# Activity Predictor Model

This directory contains the machine learning pipeline, training scripts, and serving configuration for the **Activity Predictor**. This model is a multi-label classifier designed to suggest relevant map layers based on an activity's title and its associated emergency domains.

## The Model Architecture

The model is a **Multi-Input Neural Network** built using the Keras Functional API. It combines two distinct information streams:

1.  **Textual Input (`bert_input`):** 768-dimensional embeddings generated from the activity title using **RobBERT** (a Dutch BERT model: `pdelobelle/robbert-v2-dutch-base`).
2.  **Categorical Input (`domain_input`):** A multi-label binarized vector representing the involved domains (e.g., `brandweer`, `politie`, `GGD`).

### How it Works
- The **BERT branch** processes semantic meaning from the title.
- The **Domain branch** acts as a categorical filter/prior, though it is intentionally weighted lower (`0.3x`) to ensure the text remains the primary driver of predictions.
- These branches are concatenated and passed through several dense layers with **Batch Normalization** and **Dropout** to prevent overfitting.
- The output layer uses a **Sigmoid** activation for multi-label classification, optimized using **Binary Focal Crossentropy** to handle class imbalance.

## Model Derivation & Training

The model is derived from `mockdata.yaml`, which contains a curated set of Dutch emergency activities, their standard domains, and the corresponding map layers they typically require.

### Training Pipeline (`robbert_training.py`):
1.  **Data Loading:** Parses `mockdata.yaml`.
2.  **Label Encoding:** Uses `MultiLabelBinarizer` for both input domains and output layers.
3.  **Embedding Generation:** Uses the `transformers` library to compute mean-pooled RobBERT embeddings for every activity name.
4.  **Training:** Fits the functional model with early stopping and learning rate reduction.
5.  **Export:**
    - **Model:** Saved in `SavedModel` format to `tf_serving_models/activity_predictor/1/`.
    - **Metadata:** Exported to `model_metadata.json` (and synced to the frontend). This file contains the class mappings (e.g., `layers_classes`) required to decode the model's raw output.

### Local Setup

```bash
# Using a virtualenv
python -m venv .venv_ml
source .venv_ml/bin/activate
pip install -r tensorflow/requirements.txt

# Run the training script
python tensorflow/robbert_training.py
```

## Services & Orchestration

The "Complete Model" is actually a distributed system of three components:

1.  **Embedding Service (Port 8000):** A FastAPI wrapper around RobBERT. It turns "brand in schouwburg" into a 768D vector.
2.  **TensorFlow Serving (Port 8501):** Hosts the trained `.pb` model. It receives the 768D vector + Domain vector and returns raw probabilities.
3.  **Frontend API (`/api/predict`):** The orchestrator. It fetches embeddings, calls TF Serving, and uses `model_metadata.json` to turn raw floats back into human-readable layer names.

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
