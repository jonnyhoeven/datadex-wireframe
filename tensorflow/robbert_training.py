import yaml
import numpy as np
import torch
import tensorflow as tf
import os
import json
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from transformers import AutoTokenizer, AutoModel

# 1. Data Loading
def load_data(file_path=None):
    if file_path is None:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, 'mockdata.yaml')
        
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
    activities = data['activities']
    names = [a['name'] for a in activities]
    domeinen = [a['domeinen'] for a in activities]
    layers = [a['layers'] for a in activities]
    return names, domeinen, layers

# 2. Feature Engineering (BERT Embeddings)
def get_bert_embeddings(texts, model_name='pdelobelle/robbert-v2-dutch-base'):
    print(f"Loading {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    
    print(f"Encoding {len(texts)} texts...")
    encoded_input = tokenizer(texts, padding=True, truncation=True, return_tensors='pt')
    
    with torch.no_grad():
        model_output = model(**encoded_input)
    
    # Mean Pooling
    token_embeddings = model_output.last_hidden_state
    input_mask_expanded = encoded_input['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    mean_embeddings = sum_embeddings / sum_mask
    
    return mean_embeddings.numpy()

# 3. Main Pipeline
def main():
    print("Loading data...")
    names, domeinen, layers = load_data()

    print("Encoding labels...")
    mlb_domeinen = MultiLabelBinarizer()
    domeinen_encoded = mlb_domeinen.fit_transform(domeinen)
    
    mlb_layers = MultiLabelBinarizer()
    layers_encoded = mlb_layers.fit_transform(layers)

    print("Generating RobBERT embeddings (this may take a while)...")
    bert_embeddings = get_bert_embeddings(names)

    # Concatenate [domeinen, embeddings]
    X = np.hstack((domeinen_encoded, bert_embeddings))
    y = layers_encoded

    print(f"Feature shape: {X.shape}")
    print(f"Target shape: {y.shape}")

    # 4. Training
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    input_dim = X.shape[1]
    output_dim = y.shape[1]

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(output_dim, activation='sigmoid')
    ])

    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    print("Starting training...")
    model.fit(X_train, y_train, epochs=50, batch_size=2, verbose=1, validation_data=(X_test, y_test))

    # 5. Save model for TF Serving (Always version 1)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_version = "1"
    model_export_path = os.path.join(base_dir, 'tf_serving_models/activity_predictor', model_version)

    # Verwijder oude model als het bestaat om overschrijven te forceren
    if os.path.exists(model_export_path):
        import shutil
        shutil.rmtree(model_export_path)

    print(f"Saving model to {model_export_path}...")
    model.export(model_export_path)

    # 6. Export metadata for frontend use
    metadata = {
        "domeinen_classes": mlb_domeinen.classes_.tolist(),
        "layers_classes": mlb_layers.classes_.tolist(),
        "feature_type": "robbert",
        "bert_model": "pdelobelle/robbert-v2-dutch-base",
        "input_dim": input_dim
    }
    
    metadata_path = os.path.join(base_dir, 'model_metadata.json')
    frontend_metadata_path = os.path.join(os.path.dirname(base_dir), 'frontend/app/api/predict/model_metadata.json')
    
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"Metadata exported to {metadata_path}")
    
    try:
        with open(frontend_metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"Metadata also exported to {frontend_metadata_path}")
    except Exception as e:
        print(f"Could not export metadata to frontend: {e}")

if __name__ == "__main__":
    main()
