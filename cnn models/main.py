# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import img_to_array
# from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
# from PIL import Image
# import numpy as np
# import io
# import os
# from flask_cors import CORS
# from tensorflow.keras.utils import get_custom_objects
# import tensorflow.keras.backend as K
# from tensorflow.keras.layers import Lambda
# import tensorflow as tf


# app = Flask(__name__)
# CORS(app)

# # Register 'TrueDivide' if it's a lambda function or custom layer
# # Define a wrapper function for TrueDivide
# # def true_divide(x):
# #     # Assuming x is a single input and internally does x / some constant or something
# #     # Update logic based on your model definition
# #     return tf.math.divide(x[0], x[1]) if isinstance(x, (list, tuple)) else x  # Placeholder
# true_divide = Lambda(lambda x: (x / 127.5) - 1.0)

# get_custom_objects().update({"TrueDivide": true_divide})



# # Load the trained oral disease model
# model_path = "oral_disease_model.h5"
# if not os.path.exists(model_path):
#     print(f"Error: Model file '{model_path}' not found!")
#     model = None
# else:
#     try:
#         model = load_model(model_path)
#         print(f"Model loaded successfully from {model_path}")
#     except Exception as e:
#         print(f"Error loading model: {e}")
#         model = None

# # Define class labels in the same order as model training
# class_labels = ['Calculus', 'Gingivitis', 'Mouth Ulcer', 'Tooth Discoloration', 'hypodontia']
# IMG_SIZE = (224, 224)

# @app.route("/", methods=["GET"])
# def health_check():
#     return jsonify({
#         "status": "healthy",
#         "model_loaded": model is not None,
#         "message": "Oral disease prediction API is running"
#     })

# @app.route("/cnn-predict-mouth", methods=["POST"])
# def predict_image():
#     try:
#         if model is None:
#             return jsonify({"error": "Model not loaded. Please check server logs."}), 500

#         if 'file' not in request.files:
#             return jsonify({"error": "No file part in request"}), 400

#         file = request.files['file']
        
#         if file.filename == '':
#             return jsonify({"error": "No file selected"}), 400

#         if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
#             return jsonify({"error": "Invalid file type. Please upload an image file."}), 400

#         print(f"Processing file: {file.filename}")

#         try:
#             img = Image.open(io.BytesIO(file.read())).convert("RGB")
#             print(f"Original image size: {img.size}")
#             img = img.resize(IMG_SIZE)
#             img_array = img_to_array(img)
#             img_array = preprocess_input(img_array)
#             img_array = np.expand_dims(img_array, axis=0)
#             print(f"Preprocessed image shape: {img_array.shape}")
#         except Exception as e:
#             return jsonify({"error": f"Error processing image: {str(e)}"}), 400

#         try:
#             # predictions = model.predict(img_array)
#             # predicted_index = np.argmax(predictions[0])
#             # predicted_label = class_labels[predicted_index]
#             # confidence = float(predictions[0][predicted_index])

#             # print(f"Prediction: {predicted_label} (confidence: {confidence:.4f})")

#             result = {
#                 "predicted_class": "mouth ulcer",
#                 # "confidence": round(confidence * 100, 2),
#                 # "all_predictions": {
#                 #     class_labels[i]: round(float(predictions[0][i]) * 100, 2) 
#                 #     for i in range(len(class_labels))
#                 # }
#             }

#             return jsonify(result)

#         except Exception as e:
#             return jsonify({"error": f"Error during prediction: {str(e)}"}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({"error": f"Internal server error: {str(e)}"}), 500

# @app.errorhandler(413)
# def too_large(e):
#     return jsonify({"error": "File too large"}), 413

# @app.errorhandler(404)
# def not_found(e):
#     return jsonify({"error": "Endpoint not found"}), 404

# @app.errorhandler(500)
# def internal_error(e):
#     return jsonify({"error": "Internal server error"}), 500

# if __name__ == "__main__":
#     if model is None:
#         print("WARNING: Model not loaded! Server will start but predictions will fail.")

#     print("Starting Flask server on port 7000...")
#     print("Available endpoints:")
#     print("  GET  / - Health check")
#     print("  POST /cnn-predict-mouth - Image prediction")

#     app.run(debug=True, port=7000, host='0.0.0.0')
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import numpy as np
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained model
model_path = "oral_disease_model.h5"
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

# Class labels
class_labels = ['Calculus', 'Gingivitis', 'Mouth Ulcer', 'Tooth Discoloration', 'hypodontia']
IMG_SIZE = (224, 224)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "message": "Oral disease prediction API is running"
    })

@app.route("/cnn-predict-mouth", methods=["POST"])
def predict_image():
    try:
        if model is None:
            return jsonify({"error": "Model not loaded. Please check server logs."}), 500

        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            return jsonify({"error": "Invalid file type. Please upload an image file."}), 400

        print(f"Processing file: {file.filename}")

        try:
            img = Image.open(io.BytesIO(file.read())).convert("RGB")
            img = img.resize(IMG_SIZE)
            img_array = img_to_array(img)
            img_array = preprocess_input(img_array)  # This normalizes the image
            img_array = np.expand_dims(img_array, axis=0)
        except Exception as e:
            return jsonify({"error": f"Error processing image: {str(e)}"}), 400

        try:
            predictions = model.predict(img_array)
            predicted_index = np.argmax(predictions[0])
            predicted_label = class_labels[predicted_index]
            confidence = float(predictions[0][predicted_index])

            result = {
                "predicted_class": predicted_label,
                "confidence": round(confidence * 100, 2),
                "all_predictions": {
                    class_labels[i]: round(float(predictions[0][i]) * 100, 2) 
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

    print("Starting Flask server on port 7000...")
    print("Available endpoints:")
    print("  GET  / - Health check")
    print("  POST /cnn-predict-mouth - Image prediction")

    app.run(debug=True, port=7000, host='0.0.0.0')
