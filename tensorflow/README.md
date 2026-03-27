# Activity Predictor API

This directory contains the TensorFlow Serving configuration for the `activity_predictor` model.

## For Frontend Developers

The TensorFlow service is hosted inside the Docker stack on port `8501`, but it is **proxied via the Next.js frontend** to simplify development and avoid CORS issues.

### Base Proxy URL
Use relative paths in your frontend code:
` /api/activity-predictor/v1/models/activity_predictor `

### 1. Check Model Metadata
To check if the model is loaded and see the required input/output tensor names:
```javascript
const response = await fetch('/api/activity-predictor/v1/models/activity_predictor/metadata');
const data = await response.json();
console.log(data);
```

### 2. Make a Prediction
To get a prediction, send a POST request to the `:predict` endpoint.

**Endpoint:** `POST /api/activity-predictor/v1/models/activity_predictor:predict`

**Example Code:**
```javascript
async function getPrediction(inputData) {
  const response = await fetch('/api/activity-predictor/v1/models/activity_predictor:predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Input data must be wrapped in an "instances" array
      // Each element in the array is one input sample
      instances: [
        inputData // e.g., [1.0, 0.5, 0.2]
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Prediction request failed');
  }

  const result = await response.json();
  return result.predictions;
}
```

### Important Notes
- **Input Format**: The `instances` array is mandatory. Each item in the array should match the input shape of the model (usually an array of numbers).
- **CORS**: By using the `/api/activity-predictor/` path, you avoid all Cross-Origin Resource Sharing (CORS) issues because the request stays on the same origin (`localhost:3000`).
- **Configuration**: The proxy logic is defined in `frontend/next.config.mjs`.

## Docker Configuration
The service runs using the `emacski/tensorflow-serving:latest` image (compatible with ARM64/Apple Silicon). It loads models from the `tf_serving_models/` directory.
