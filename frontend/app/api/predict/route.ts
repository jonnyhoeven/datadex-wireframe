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
    description: 'Activity Predictor API',
    usage: 'POST to this endpoint with { title: string, domeinen: string[] }',
    metadata: {
      domeinen_classes: meta.domeinen_classes,
      layers_classes: meta.layers_classes,
      vocabulary_size: Object.keys(meta.tfidf_vocabulary).length
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, domeinen } = body;

    if (!title || !Array.isArray(domeinen)) {
      return NextResponse.json({ error: 'Missing title or domeinen array' }, { status: 400 });
    }

    const meta = loadMetadata();
    if (!meta) {
      return NextResponse.json({ error: 'Model metadata not found' }, { status: 500 });
    }

    // 1. Vectorize inputs
    const domeinenEncoded = encodeDomeinen(domeinen, meta.domeinen_classes);
    const titleEncoded = vectorizeTitle(title, meta.tfidf_vocabulary, meta.tfidf_idf);

    // 2. Concatenate (domeinen first, then title, matching api_test.py)
    const X_encoded = [...domeinenEncoded, ...titleEncoded];

    // 3. Call TensorFlow Serving
    // We use the rewrite-capable relative URL or the direct one.
    // Inside the server, calling 127.0.0.1:8501 is fine if it's mapped.
    // If running inside Docker network, we might need 'http://tensorflow:8501'.
    // But since this is Next.js running on the host (usually), 127.0.0.1 works.
    const tfServingUrl = process.env.TF_SERVING_URL || 'http://127.0.0.1:8501/v1/models/activity_predictor:predict';
    
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

    // 4. Decode (threshold at 0.5)
    const predictedLayers = meta.layers_classes.filter((_: string, i: number) => predictions[i] > 0.5);

    return NextResponse.json({
      predicted_layers: predictedLayers,
      raw_predictions: predictions
    });

  } catch (error: any) {
    console.error('Prediction API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
