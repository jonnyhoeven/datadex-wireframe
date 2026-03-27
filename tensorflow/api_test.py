import yaml
import numpy as np
import requests
import json
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.feature_extraction.text import TfidfVectorizer
import scipy.sparse

# 1. Load mock data to fit the encoders (same as in training)
with open('tensorflow/mockdata.yaml', 'r') as file:
    mock_data = yaml.safe_load(file)

activities = mock_data['activities']
names_data = [activity['name'] for activity in activities]
domeinen_data = [activity['domeinen'] for activity in activities]
layers_data = [activity['layers'] for activity in activities]

# Encode 'domeinen'
mlb_domeinen = MultiLabelBinarizer()
mlb_domeinen.fit(domeinen_data)

# Encode 'name' using TfidfVectorizer
tfidf_vectorizer = TfidfVectorizer(max_features=10)
tfidf_vectorizer.fit(names_data)

# Encode 'layers' (target) to get classes for decoding
mlb_layers = MultiLabelBinarizer()
mlb_layers.fit(layers_data)

# 2. Prepare API call for each activity in mockdata
url = "http://localhost:8501/v1/models/activity_predictor:predict"

results = []

for activity in activities:
    name = activity['name']
    domeinen = activity['domeinen']
    
    # Preprocess
    name_encoded = tfidf_vectorizer.transform([name]).toarray()
    domeinen_encoded = mlb_domeinen.transform([domeinen])
    X_encoded = np.hstack((domeinen_encoded, name_encoded))
    
    # API Call
    payload = {
        "instances": X_encoded.tolist()
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        predictions = response.json()['predictions']
        # Decode
        predicted_labels_binary = (np.array(predictions) > 0.5).astype(int)
        predicted_layers = mlb_layers.inverse_transform(predicted_labels_binary)
        
        results.append({
            "activity": name,
            "actual_layers": activity['layers'],
            "predicted_layers": list(predicted_layers[0])
        })
    else:
        print(f"Error for {name}: Status {response.status_code} - {response.text}")

# 3. Print results
print(json.dumps(results, indent=2))
