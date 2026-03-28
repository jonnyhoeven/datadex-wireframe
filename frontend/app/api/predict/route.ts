import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load model metadata for vectorization and decoding
const metadataPath = path.join(process.cwd(), 'app/api/predict/model_metadata.json');
let metadata: any = null;

function loadMetadata() {
  if (!metadata) {
    try {
      const data = fs.readFileSync(metadataPath, 'utf8');
      metadata = JSON.parse(data);
    } catch (error) {
      console.error('Error loading model metadata:', error);
    }
  }
  return metadata;
}

/**
 * Perform TF-IDF vectorization manually (matching scikit-learn's default behavior)
 */
function vectorizeTitle(title: string, vocabulary: { [key: string]: number }, idf: number[]) {
  const vector = new Array(Object.keys(vocabulary).length).fill(0);
  // Simple tokenization: lowercase and split by non-alphanumeric characters
  const tokens = title.toLowerCase().split(/[^a-z0-9]+/);

  tokens.forEach(token => {
    if (token in vocabulary) {
      const idx = vocabulary[token];
      vector[idx] += 1;
    }
  });

  // Apply IDF
  for (let i = 0; i < vector.length; i++) {
    vector[i] *= idf[i];
  }

  // L2 Normalization (default in TfidfVectorizer)
  const sumSq = vector.reduce((sum, val) => sum + val * val, 0);
  if (sumSq > 0) {
    const norm = Math.sqrt(sumSq);
    for (let i = 0; i < vector.length; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * MultiLabelBinarizer-style encoding for domeinen
 */
function encodeDomeinen(inputDomeinen: string[], domeinenClasses: string[]) {
  return domeinenClasses.map(cls => (inputDomeinen.includes(cls) ? 1 : 0));
}

export async function GET() {
  const meta = loadMetadata();
  if (!meta) {
    return NextResponse.json({ error: 'Model metadata not found' }, { status: 500 });
  }

  return NextResponse.json({
    status: 'Ready',
    description: 'Activity Predictor API (BERT Enabled)',
    usage: 'POST to this endpoint with { title: string, domeinen: string[] }',
    metadata: {
      domeinen_classes: meta.domeinen_classes,
      layers_classes: meta.layers_classes,
      feature_type: meta.feature_type
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, domeinen, version } = body;

    if (!title || !Array.isArray(domeinen)) {
      return NextResponse.json({ error: 'Missing title or domeinen array' }, { status: 400 });
    }

    const meta = loadMetadata();
    if (!meta) {
      return NextResponse.json({ error: 'Model metadata not found' }, { status: 500 });
    }

    // 1. Get BERT Embeddings from the Python Service
    const embeddingServiceUrl = process.env.EMBEDDING_SERVICE_URL || 'http://127.0.0.1:8000/embed';
    
    const embResponse = await fetch(embeddingServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: [title] })
    });

    if (!embResponse.ok) {
      const errorText = await embResponse.text();
      return NextResponse.json({ error: 'Embedding Service error', details: errorText }, { status: embResponse.status });
    }

    const embData = await embResponse.json();
    const titleEmbedding = embData.embeddings[0]; // 768 dimensions

    // 2. Encode domeinen
    const domeinenEncoded = encodeDomeinen(domeinen, meta.domeinen_classes);

    // 3. Concatenate [domeinen, titleEmbedding]
    const X_encoded = [...domeinenEncoded, ...titleEmbedding];

    // 4. Call TensorFlow Serving (Always uses latest version, which is now fixed to '1')
    const modelName = process.env.TF_MODEL_NAME || 'activity_predictor';
    const tfServingUrl = process.env.TF_SERVING_URL || `http://127.0.0.1:8501/v1/models/${modelName}:predict`;
    
    const response = await fetch(tfServingUrl, {
      method: 'POST',
      body: JSON.stringify({
        instances: [X_encoded]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'TF Serving error', details: errorText }, { status: response.status });
    }

    const result = await response.json();
    const predictions = result.predictions[0];

    // 5. Decode and Sort by relevance
    const scoredLayers = meta.layers_classes.map((name: string, i: number) => ({
      name,
      score: predictions[i]
    }));

    // Sort descending by score
    scoredLayers.sort((a: any, b: any) => b.score - a.score);

    // Filter by threshold for the "positive" predictions (but they are now sorted!)
    const predictedLayers = scoredLayers
      .filter((l: any) => l.score > 0.0001)
      .map((l: any) => l.name);

    return NextResponse.json({
      predicted_layers: predictedLayers,
      scored_predictions: scoredLayers.filter((l: any) => l.score > 0.0001),
      //raw_predictions: predictions
    });

  } catch (error: any) {
    console.error('Prediction API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
