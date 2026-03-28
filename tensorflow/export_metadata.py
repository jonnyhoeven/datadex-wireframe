import yaml
import json
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.feature_extraction.text import TfidfVectorizer

# Load mock data to fit the encoders (same as in training/test)
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

# Encode 'layers' (target)
mlb_layers = MultiLabelBinarizer()
mlb_layers.fit(layers_data)

# Export metadata
metadata = {
    "domeinen_classes": mlb_domeinen.classes_.tolist(),
    "tfidf_vocabulary": {k: int(v) for k, v in tfidf_vectorizer.vocabulary_.items()},
    "tfidf_idf": tfidf_vectorizer.idf_.tolist(),
    "layers_classes": mlb_layers.classes_.tolist()
}

with open('tensorflow/model_metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("Metadata exported to tensorflow/model_metadata.json")
