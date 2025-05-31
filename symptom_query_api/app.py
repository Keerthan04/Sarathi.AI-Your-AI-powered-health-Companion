from flask import Flask, request, jsonify
import pickle
import numpy as np

# Initialize Flask app
app = Flask(__name__)

# Load model and vectorizer
model = pickle.load(open('models/model.pkl', 'rb'))
vectorizer = pickle.load(open('models/vectorizer.pkl', 'rb'))

# Label mapping (you can also load this from a JSON or file if preferred)
prediction_labels = {
    'Emotional pain': 0, 'Hair falling out': 1, 'Head hurts': 2, 'Infected wound': 3, 'Foot achne': 4,
    'Shoulder pain': 5, 'Injury from sports': 6, 'Skin issue': 7, 'Stomach ache': 8, 'Knee pain': 9,
    'Joint pain': 10, 'Hard to breath': 11, 'Head ache': 12, 'Body feels weak': 13, 'Feeling dizzy': 14,
    'Back pain': 15, 'Open wound': 16, 'Internal pain': 17, 'Blurry vision': 18, 'Acne': 19, 'Neck pain': 21,
    'Cough': 22, 'Ear achne': 23, 'Feeling cold': 24
}
# Invert the dictionary to get class name from prediction
label_lookup = {v: k for k, v in prediction_labels.items()}

# Route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    if not data or 'symptom' not in data:
        return jsonify({'error': 'Please provide a symptom string under the key "symptom".'}), 400

    symptom_text = data['symptom']

    try:
        # Vectorize input and predict
        vectorized = vectorizer.transform([symptom_text])
        prediction = model.predict(vectorized)[0]

        result = label_lookup.get(prediction, "Unknown")

        return jsonify({
            'symptom': symptom_text,
            'predicted_class': result
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
