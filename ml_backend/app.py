from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import numpy as np
from PIL import Image
import io
import json
import os

app = Flask(__name__)
CORS(app)

# Load model and class information
MODEL_PATH = 'plant_disease_model.h5'
CLASS_INDICES_PATH = 'class_indices.json'
DISEASE_INFO_PATH = 'disease_info.json'

model = None
class_names = {}
disease_info = {}

def load_model_and_info():
    global model, class_names, disease_info
    
    if os.path.exists(MODEL_PATH):
        model = keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")
        print("Please train the model first using train_model.py")
    
    if os.path.exists(CLASS_INDICES_PATH):
        with open(CLASS_INDICES_PATH, 'r') as f:
            class_indices = json.load(f)
            # Reverse mapping: index -> class_name
            class_names = {v: k for k, v in class_indices.items()}
    
    if os.path.exists(DISEASE_INFO_PATH):
        with open(DISEASE_INFO_PATH, 'r') as f:
            disease_info = json.load(f)

def preprocess_image(image_bytes):
    """Preprocess image for model prediction"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "classes_loaded": len(class_names) > 0
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Predict plant disease from uploaded image"""
    
    if model is None:
        return jsonify({
            "error": "Model not loaded. Please train the model first."
        }), 500
    
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    try:
        # Get image from request
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Preprocess and predict
        processed_image = preprocess_image(image_bytes)
        predictions = model.predict(processed_image, verbose=0)
        
        # Get top prediction
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        predicted_class_name = class_names.get(predicted_class_idx, "Unknown")
        
        # Get disease information
        info = disease_info.get(predicted_class_name, {
            "plant": "Unknown",
            "disease": "Unknown",
            "causes": "Information not available",
            "symptoms": "Information not available",
            "treatment": "Information not available",
            "prevention": "Information not available"
        })
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        alternative_predictions = [
            {
                "class": class_names.get(int(idx), "Unknown"),
                "confidence": float(predictions[0][idx])
            }
            for idx in top_3_indices
        ]
        
        return jsonify({
            "success": True,
            "plant": info["plant"],
            "disease": info["disease"],
            "confidence": confidence,
            "causes": info["causes"],
            "symptoms": info["symptoms"],
            "treatment": info["treatment"],
            "prevention": info["prevention"],
            "alternative_predictions": alternative_predictions
        })
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({
            "error": f"Prediction failed: {str(e)}"
        }), 500

@app.route('/classes', methods=['GET'])
def get_classes():
    """Get all available disease classes"""
    return jsonify({
        "classes": list(class_names.values()),
        "count": len(class_names)
    })

if __name__ == '__main__':
    load_model_and_info()
    print("\n" + "="*50)
    print("Plant Disease Detection API")
    print("="*50)
    print(f"Model loaded: {model is not None}")
    print(f"Number of classes: {len(class_names)}")
    print("\nEndpoints:")
    print("  GET  /health  - Health check")
    print("  POST /predict - Predict disease from image")
    print("  GET  /classes - Get available classes")
    print("\nStarting server on http://localhost:5000")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
