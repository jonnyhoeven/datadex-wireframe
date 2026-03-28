import yaml
import numpy as np
import requests
import json
import os
from sklearn.preprocessing import MultiLabelBinarizer

# 1. Load mock data to fit the encoders (same as in training)
base_dir = os.path.dirname(os.path.abspath(__file__))
mockdata_path = os.path.join(base_dir, 'mockdata.yaml')
metadata_path = os.path.join(base_dir, 'model_metadata.json')

with open(mockdata_path, 'r', encoding='utf-8') as file:
    mock_data = yaml.safe_load(file)

with open(metadata_path, 'r', encoding='utf-8') as file:
    metadata = json.load(file)

activities = mock_data['activities']
names_data = [activity['name'] for activity in activities]
domeinen_data = [activity['domeinen'] for activity in activities]
layers_data = [activity['layers'] for activity in activities]

# Encode 'domeinen'
mlb_domeinen = MultiLabelBinarizer()
mlb_domeinen.fit(domeinen_data)

# Encode 'layers' (target) to get classes for decoding
mlb_layers = MultiLabelBinarizer()
mlb_layers.fit(layers_data)

# 2. Service URLs
EMBEDDING_URL = "http://localhost:8000/embed"
TF_SERVING_URL = "http://localhost:8501/v1/models/activity_predictor:predict"

print(f"Requesting embeddings for {len(names_data)} activities...")
try:
    # Batch request for efficiency
    embed_response = requests.post(EMBEDDING_URL, json={"texts": names_data})
    embed_response.raise_for_status()
    all_embeddings = np.array(embed_response.json()['embeddings'])
except Exception as e:
    print(f"Error calling embedding service at {EMBEDDING_URL}: {e}")
    print("Ensure the embedding service is running (e.g., docker-compose up embedding_service)")
    exit(1)

results = []
thresholds = metadata.get('thresholds', {})

print("Running predictions via TF Serving...")
# Sample 10 for quick verification
sample_indices = np.random.choice(len(activities), 10, replace=False)

for idx in sample_indices:
    activity = activities[idx]
    name = activity['name']
    domeinen = activity['domeinen']
    
    # Preprocess: Functional API format
    bert_encoded = all_embeddings[idx].tolist()
    domeinen_encoded = mlb_domeinen.transform([domeinen])[0].tolist()
    
    # API Call to TF Serving with named inputs
    payload = {
        "instances": [
            {
                "domain_input": domeinen_encoded,
                "bert_input": bert_encoded
            }
        ]
    }
    
    try:
        response = requests.post(TF_SERVING_URL, json=payload)
        if response.status_code == 200:
            predictions = response.json()['predictions'][0]
            
            # Decode using optimized thresholds
            predicted_layers = []
            for i, class_name in enumerate(mlb_layers.classes_):
                thresh = thresholds.get(class_name, 0.5)
                if predictions[i] > thresh:
                    predicted_layers.append(class_name)
            
            results.append({
                "activity": name,
                "actual_layers": activity['layers'],
                "predicted_layers": predicted_layers
            })
        else:
            print(f"Error for {name}: Status {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error calling TF Serving: {e}")
        break

# 3. Output results
output_path = os.path.join(base_dir, 'api_test_output.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f"Test completed on sample. Results saved to {output_path}")
print(json.dumps(results[:2], indent=2))
