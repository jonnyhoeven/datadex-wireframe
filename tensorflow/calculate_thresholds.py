import numpy as np
import tensorflow as tf
import json
import os
import yaml
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import f1_score
from transformers import AutoTokenizer, AutoModel
import torch

def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = yaml.safe_load(file)
    activities = data['activities']
    names = [a['name'] for a in activities]
    domeinen = [a['domeinen'] for a in activities]
    layers = [a['layers'] for a in activities]
    return names, domeinen, layers

def get_bert_embeddings(texts, model_name='pdelobelle/robbert-v2-dutch-base'):
    print(f"Loading {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    
    print(f"Encoding {len(texts)} texts...")
    # Batch processing to avoid OOM
    batch_size = 32
    all_embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i+batch_size]
        encoded_input = tokenizer(batch_texts, padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            model_output = model(**encoded_input)
        token_embeddings = model_output.last_hidden_state
        input_mask_expanded = encoded_input['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
        sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
        sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
        mean_embeddings = sum_embeddings / sum_mask
        all_embeddings.append(mean_embeddings.numpy())
    
    return np.vstack(all_embeddings)

def calculate_optimal_thresholds():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    mockdata_path = os.path.join(base_dir, 'mockdata.yaml')
    model_path = os.path.join(base_dir, 'tf_serving_models/activity_predictor/1')
    metadata_path = os.path.join(base_dir, 'model_metadata.json')

    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}. Please run training first.")
        return

    print("Loading data...")
    names, domeinen, layers = load_data(mockdata_path)

    print("Encoding labels...")
    mlb_domeinen = MultiLabelBinarizer()
    domeinen_encoded = mlb_domeinen.fit_transform(domeinen).astype(np.float32)
    mlb_layers = MultiLabelBinarizer()
    layers_encoded = mlb_layers.fit_transform(layers).astype(np.float32)

    print("Generating BERT embeddings...")
    bert_embeddings = get_bert_embeddings(names).astype(np.float32)

    # Use same split logic as in training (if possible)
    # Actually, we can just use the whole set or a dedicated validation set.
    # To keep it simple and consistent with the recommendation, we split.
    _, X_test_domain, _, y_test = train_test_split(domeinen_encoded, layers_encoded, test_size=0.2, random_state=42)
    _, X_test_bert, _, _ = train_test_split(bert_embeddings, layers_encoded, test_size=0.2, random_state=42)

    print("Loading model for threshold calculation...")
    model = tf.saved_model.load(model_path)
    infer = model.signatures['serving_default'] # 'serving_default' is the default name

    print(f"Inputs: {infer.structured_input_signature}")
    
    # Predicting in batches
    all_preds = []
    batch_size = 32
    for i in range(0, len(X_test_domain), batch_size):
        d_batch = X_test_domain[i:i+batch_size]
        b_batch = X_test_bert[i:i+batch_size]
        
        # Call signature with named arguments
        pred = infer(domain_input=tf.constant(d_batch), bert_input=tf.constant(b_batch))
        output_key = list(pred.keys())[0]
        all_preds.append(pred[output_key].numpy())
    
    y_pred_probs = np.vstack(all_preds)

    print("Calculating optimal thresholds for each layer...")
    optimal_thresholds = {}
    layer_names = mlb_layers.classes_

    for i in range(len(layer_names)):
        best_f1 = 0
        best_thresh = 0.5
        # Search for best threshold between 0.05 and 0.95
        for thresh in np.arange(0.05, 0.95, 0.05):
            f1 = f1_score(y_test[:, i], (y_pred_probs[:, i] > thresh).astype(int), zero_division=0)
            if f1 > best_f1:
                best_f1 = f1
                best_thresh = thresh
        optimal_thresholds[layer_names[i]] = float(best_thresh)

    print("Updating metadata with thresholds...")
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    metadata['thresholds'] = optimal_thresholds
    
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    # Update frontend
    frontend_metadata_path = os.path.join(os.path.dirname(base_dir), 'frontend/app/predict/api/model_metadata.json')
    try:
        with open(frontend_metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        print("Thresholds updated in local and frontend metadata.")
    except Exception as e:
        print(f"Could not update frontend metadata: {e}")

if __name__ == "__main__":
    calculate_optimal_thresholds()
