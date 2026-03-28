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
        
    with open(file_path, 'r', encoding='utf-8') as file:
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
    # Process in batches to avoid OOM
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

# 3. Model Architecture (Functional API)
def build_model(domain_dim, bert_dim, output_dim):
    # Inputs
    domain_input = tf.keras.layers.Input(shape=(domain_dim,), name='domain_input')
    bert_input = tf.keras.layers.Input(shape=(bert_dim,), name='bert_input')
    
    # Domain branch: Upsample the categorical features to give them more weight
    domain_branch = tf.keras.layers.Dense(64, activation='relu')(domain_input)
    domain_branch = tf.keras.layers.BatchNormalization()(domain_branch)
    
    # BERT branch: Process embeddings slightly
    bert_branch = tf.keras.layers.Dense(256, activation='relu')(bert_input)
    bert_branch = tf.keras.layers.BatchNormalization()(bert_branch)
    
    # Concatenate processed branches
    x = tf.keras.layers.Concatenate()([domain_branch, bert_branch])
    
    # Hidden Layers
    x = tf.keras.layers.Dense(256, activation='relu')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    
    x = tf.keras.layers.Dense(128, activation='relu')(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    
    # Output
    output = tf.keras.layers.Dense(output_dim, activation='sigmoid', name='output')(x)
    
    model = tf.keras.models.Model(inputs=[domain_input, bert_input], outputs=output)
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=[
            tf.keras.metrics.Precision(name='precision'), 
            tf.keras.metrics.Recall(name='recall'), 
            'accuracy',
            tf.keras.metrics.TopKCategoricalAccuracy(k=5, name='top_5_accuracy')
        ]
    )
    
    return model

# 4. Main Pipeline
def main():
    print("Loading data...")
    names, domeinen, layers = load_data()

    print("Encoding labels...")
    mlb_domeinen = MultiLabelBinarizer()
    domeinen_encoded = mlb_domeinen.fit_transform(domeinen).astype(np.float32)
    
    mlb_layers = MultiLabelBinarizer()
    layers_encoded = mlb_layers.fit_transform(layers).astype(np.float32)

    print("Generating RobBERT embeddings...")
    bert_embeddings = get_bert_embeddings(names).astype(np.float32)

    # Split data
    indices = np.arange(len(names))
    train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42)
    
    X_train_domain = domeinen_encoded[train_idx]
    X_train_bert = bert_embeddings[train_idx]
    y_train = layers_encoded[train_idx]
    
    X_test_domain = domeinen_encoded[test_idx]
    X_test_bert = bert_embeddings[test_idx]
    y_test = layers_encoded[test_idx]

    print(f"Training data shapes: Domain {X_train_domain.shape}, BERT {X_train_bert.shape}")

    # Build model
    model = build_model(domeinen_encoded.shape[1], bert_embeddings.shape[1], layers_encoded.shape[1])
    model.summary()

    # Callbacks
    callbacks = [
        tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True),
        tf.keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=7, min_lr=0.00001)
    ]

    print("Starting training...")
    model.fit(
        {'domain_input': X_train_domain, 'bert_input': X_train_bert},
        y_train,
        epochs=300,
        batch_size=8,
        validation_data=({'domain_input': X_test_domain, 'bert_input': X_test_bert}, y_test),
        callbacks=callbacks,
        verbose=1
    )

    # 5. Save model for TF Serving
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_version = "1"
    model_export_path = os.path.join(base_dir, 'tf_serving_models/activity_predictor', model_version)

    if os.path.exists(model_export_path):
        import shutil
        shutil.rmtree(model_export_path)

    print(f"Saving model to {model_export_path}...")
    # Use SavedModel format for TF Serving
    model.export(model_export_path)

    # 6. Export metadata
    metadata = {
        "domeinen_classes": mlb_domeinen.classes_.tolist(),
        "layers_classes": mlb_layers.classes_.tolist(),
        "feature_type": "robbert_functional",
        "bert_model": "pdelobelle/robbert-v2-dutch-base",
        "domain_dim": domeinen_encoded.shape[1],
        "bert_dim": bert_embeddings.shape[1]
    }
    
    metadata_path = os.path.join(base_dir, 'model_metadata.json')
    frontend_metadata_path = os.path.join(os.path.dirname(base_dir), 'frontend/app/api/predict/model_metadata.json')
    
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    try:
        with open(frontend_metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"Metadata exported to {metadata_path} and frontend.")
    except Exception as e:
        print(f"Could not export metadata to frontend: {e}")

if __name__ == "__main__":
    main()
