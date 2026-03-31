import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import metadata from './model_metadata.json';

// Define a default timeout for fetch requests
const FETCH_TIMEOUT = 5000; // 5 seconds

// Define the schema for the request body
const predictionSchema = z.object({
  title: z.string().min(0),
  domeinen: z.string().array().min(0),
});

function loadMetadata() {
  return metadata as any;
}

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
    description: 'Activity Predictor API (BERT Functional Enabled)',
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
    const validationResult = predictionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: validationResult.error.flatten() }, { status: 400 });
    }

    const { title, domeinen } = validationResult.data;

    const meta = loadMetadata();
    if (!meta) {
      return NextResponse.json({ error: 'Model metadata not found' }, { status: 500 });
    }

    // 1. Get BERT Embeddings from the Python Service
    const embeddingServiceUrl = process.env.EMBEDDING_SERVICE_URL || 'http://127.0.0.1:8000/embed';
    
    const embController = new AbortController();
    const embTimeoutId = setTimeout(() => embController.abort(), FETCH_TIMEOUT);

    let embResponse;
    try {
      embResponse = await fetch(embeddingServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: [title] }),
        signal: embController.signal
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Embedding Service request timed out' }, { status: 408 });
      }
      throw error; // Re-throw other errors
    } finally {
      clearTimeout(embTimeoutId);
    }

    if (!embResponse.ok) {
      console.error('Embedding Service error:', await embResponse.text());
      return NextResponse.json({ error: 'Embedding Service error' }, { status: embResponse.status });
    }

    const embData = await embResponse.json();
    const titleEmbedding = embData.embeddings[0]; // 768 dimensions

    // 2. Encode domeinen
    const domeinenEncoded = encodeDomeinen(domeinen, meta.domeinen_classes);

    // 3. Call TensorFlow Serving using the Functional API format
    const modelName = process.env.TF_MODEL_NAME || 'activity_predictor';
    const tfServingUrl = process.env.TF_SERVING_URL || `http://127.0.0.1:8501/v1/models/${modelName}:predict`;
    
    const tfController = new AbortController();
    const tfTimeoutId = setTimeout(() => tfController.abort(), FETCH_TIMEOUT);

    let response;
    try {
      response = await fetch(tfServingUrl, {
        method: 'POST',
        body: JSON.stringify({
          instances: [
            {
              domain_input: domeinenEncoded,
              bert_input: titleEmbedding
            }
          ]
        }),
        signal: tfController.signal
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'TensorFlow Serving request timed out' }, { status: 408 });
      }
      throw error; // Re-throw other errors
    } finally {
      clearTimeout(tfTimeoutId);
    }

    if (!response.ok) {
      console.error('TF Serving error:', await response.text());
      return NextResponse.json({ error: 'TF Serving error' }, { status: response.status });
    }

    const result = await response.json();
    const predictions = result.predictions[0];

    // 4. Decode and Sort by relevance, using optimized thresholds if available
    const scoredLayers = meta.layers_classes.map((name: string, i: number) => {
      const score = predictions[i];
      const threshold = meta.thresholds?.[name] || 0.5;
      return {
        name,
        score,
        threshold,
        is_predicted: score > threshold
      };
    });

    // Sort descending by score
    scoredLayers.sort((a: any, b: any) => b.score - a.score);

    // Filter by individual thresholds
    const predictedLayers = scoredLayers
      .filter((l: any) => l.is_predicted)
      .map((l: any) => l.name);

    return NextResponse.json({
      predicted_layers: predictedLayers,
      scored_predictions: scoredLayers.filter((l: any) => l.score > 0.001),
    });

  } catch (error: any) {
    console.error('Prediction API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
  }
}
