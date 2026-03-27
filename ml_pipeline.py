import yaml
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer

def load_and_preprocess_data(filepath):
    """Ingests mock data and prepares features (X) and target (y)."""
    with open(filepath, 'r') as file:
        data = yaml.safe_load(file)

    activities = data.get('activities', [])

    # Features (X): domeinen (Domains involved)
    # Target (y): layers (Map layers needed)
    X_raw = [activity['domeinen'] for activity in activities]
    y_raw = [activity['layers'] for activity in activities]

    # Convert lists of strings into multi-hot encoded vectors
    mlb_x = MultiLabelBinarizer()
    X = mlb_x.fit_transform(X_raw)

    mlb_y = MultiLabelBinarizer()
    y = mlb_y.fit_transform(y_raw)

    return X, y, mlb_x, mlb_y

def build_and_train(X_train, y_train, X_test, y_test, num_layers=1, epochs=100):
    """Builds and trains the Sequential model based on the protocol."""
    model = tf.keras.Sequential()

    # Input layer + first hidden layer
    model.add(tf.keras.layers.Dense(16, activation='relu', input_shape=(X_train.shape[1],)))

    # Scale architecture if needed
    for _ in range(num_layers - 1):
        model.add(tf.keras.layers.Dense(16, activation='relu'))

    # Output layer (sigmoid for multi-label classification)
    model.add(tf.keras.layers.Dense(y_train.shape[1], activation='sigmoid'))

    # Compile with Adam and MSE
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['accuracy'])

    # Train
    history = model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=epochs, verbose=0)

    return model, history

def main():
    # 1. Data Context
    X, y, mlb_x, mlb_y = load_and_preprocess_data('mockdata.yaml')

    print(f"Features (X) shape: {X.shape} - Domains mapped: {mlb_x.classes_}")
    print(f"Target (y) shape: {y.shape} - Layers mapped: {mlb_y.classes_}")

    # Validation: 80/20 Train/Test Ratio
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 2. Implementation Protocol
    print("\nTraining initial model with 1 Dense hidden layer...")
    model, history = build_and_train(X_train, y_train, X_test, y_test, num_layers=1)

    final_loss = history.history['loss'][-1]
    print(f"Final training loss after 100 epochs: {final_loss:.4f}")

    # Iterative improvement / Automated tuning
    threshold = 0.01
    if final_loss > threshold:
        print(f"\nLoss ({final_loss:.4f}) is above the {threshold} threshold. Scaling to 3 layers...")
        model, history = build_and_train(X_train, y_train, X_test, y_test, num_layers=3)
        final_loss = history.history['loss'][-1]
        print(f"New training loss after 100 epochs: {final_loss:.4f}")
    else:
        print(f"\nModel met the loss threshold ({threshold}). No scaling needed.")

    # Final Evaluation
    test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest Evaluation -> Loss: {test_loss:.4f}, Accuracy: {test_acc:.4f}")

if __name__ == '__main__':
    main()
