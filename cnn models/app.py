from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "skin_model.h5"
if not os.path.exists(model_path):
    print(f"Error: Model file '{model_path}' not found!")
    model = None
else:
    try:
        model = load_model(model_path)
        print(f"Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None

# Define class labels in the same order as model training
class_labels = [
    "Eczema",
    "Viral Infections (Warts, Molluscum, etc.)",
    "Melanoma",
    "Atopic Dermatitis",
    "Basal Cell Carcinoma (BCC)",
    "Melanocytic Nevi (NV)",
    "Benign Keratosis-like Lesions (BKL)",
    "Psoriasis and Lichen Planus",
    "Seborrheic Keratoses and Other Benign Tumors",
    "Fungal Infections (Tinea, Ringworm, Candidiasis)"
]


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "Skin condition prediction API is running"
    })

@app.route("/cnn-predict", methods=["POST"])
def predict_image():
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({"error": "Model not loaded. Please check server logs."}), 500

        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Check file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            return jsonify({"error": "Invalid file type. Please upload an image file."}), 400

        print(f"Processing file: {file.filename}")

        # Read and preprocess image
        try:
            image = Image.open(io.BytesIO(file.read())).convert("RGB")
            print(f"Original image size: {image.size}")
            
            # Resize image
            image = image.resize((256, 256))
            image_array = img_to_array(image) / 255.0
            image_array = np.expand_dims(image_array, axis=0)
            
            print(f"Preprocessed image shape: {image_array.shape}")
        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 400

        # Make prediction
        try:
            prediction = model.predict(image_array)
            predicted_index = np.argmax(prediction[0])
            predicted_label = class_labels[predicted_index]
            confidence = float(prediction[0][predicted_index])
            
            print(f"Prediction: {predicted_label} (confidence: {confidence:.4f})")
            
            result = {
                "predicted_class": predicted_label,
                "confidence": round(confidence * 100, 2),
                "all_predictions": {
                    class_labels[i]: round(float(prediction[0][i]) * 100, 2) 
                    for i in range(len(class_labels))
                }
            }
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({"error": f"Error during prediction: {str(e)}"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large"}), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    if model is None:
        print("WARNING: Model not loaded! Server will start but predictions will fail.")
    
    print("Starting Flask server on port 6000...")
    print("Available endpoints:")
    print("  GET  / - Health check")
    print("  POST /cnn-predict - Image prediction")
    
    app.run(debug=True, port=6000, host='0.0.0.0')