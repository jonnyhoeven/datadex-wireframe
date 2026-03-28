# Activity Predictor API

This directory contains the TensorFlow Serving configuration for the `activity_predictor` model.

## Model Training

The `robbert_training.py` script trains the activity predictor using **RobBERT embeddings**.

### Local Setup

```bash
# Using a virtualenv
python -m venv .venv_ml
source .venv_ml/bin/activate
pip install -r tensorflow/requirements.txt

# Run the training script
python tensorflow/robbert_training.py
```

### Script Output
- **Model:** Exported to `tf_serving_models/activity_predictor/4/`.
- **Metadata:** Exported to `model_metadata.json`.

## Services

This project uses three services for predictions:

1.  **TensorFlow Serving (Port 8501):** Hosts the trained neural network.
2.  **Embedding Service (Port 8000):** A FastAPI service that generates RobBERT embeddings for text.
3.  **Frontend API Route:** Orchestrates the flow: `Input -> Embedding Service -> TF Serving -> Output`.

### Running with Docker

```bash
docker-compose up tensorflow embedding_service
```

The `Dockerfile` in this directory copies the models into the container and starts the server on port `8501`.

## For Frontend Developers

The TensorFlow service is hosted inside the Docker stack on port `8501`, but it is **proxied via the Next.js frontend** to simplify development, avoid CORS issues, and provide a high-level friendly API.

### 1. High-Level Prediction API (Recommended)

Use the friendly API route that handles vectorization and decoding automatically. This is the easiest way to integrate predictions.

**Endpoint:** `/api/predict`

#### GET /api/predict
Returns status information and model metadata (classes for domeinen and layers).
```javascript
const response = await fetch('/api/predict');
const status = await response.json();
console.log(status.metadata.domeinen_classes); 
```

#### POST /api/predict
Submit an activity to get predicted relevant map layers.

**Body:**
```json
{
  "title": "brand bij schouwburg",
  "domeinen": ["brandweer", "politie"]
}
```

**Example Code:**
```javascript
const response = await fetch('/api/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "brand bij schouwburg",
    domeinen: ["brandweer", "politie"]
  })
});

const result = await response.json();
console.log(result.predicted_layers); // e.g., ["A Wegen", "E Gebouwen", "G scholen"]
```

### 2. Low-Level Proxy URL (Advanced)

If you need direct access to the TensorFlow Serving REST API (e.g., for raw tensor access), use the proxy rewrite:
` /api/activity-predictor/v1/models/activity_predictor `

#### Check Raw Model Metadata
```javascript
const response = await fetch('/api/activity-predictor/v1/models/activity_predictor/metadata');
const data = await response.json();
```

## Testing

You can test both the CKAN API and the Activity Predictor API using the built-in tester page:
[http://localhost:3000/api](http://localhost:3000/api)
