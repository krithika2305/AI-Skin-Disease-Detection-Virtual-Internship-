from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tensorflow as tf
import numpy as np
import json
from datetime import datetime
from utils.image_preprocessing import prepare_image

app = Flask(__name__)
app.secret_key = 'super-secret-key-for-derma-ai' # Required for sessions
CORS(app)  # Enable CORS for all routes

# File Paths
USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')
FEEDBACK_FILE = os.path.join(os.path.dirname(__file__), 'feedback.json')
PREDICTIONS_FILE = os.path.join(os.path.dirname(__file__), 'predictions.json')

# Load Model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../models/skin_disease_mobilenetv2.h5'))
model = None

try:
    if os.path.exists(MODEL_PATH):
        print(f"Loading model from {MODEL_PATH}...")
        model = tf.keras.models.load_model(MODEL_PATH)
        print("Model loaded successfully!")
    else:
        print(f"WARNING: Model not found at {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")

# Classes & Recommendations
CLASSES = {
    0: 'Actinic Keratoses', 1: 'Basal Cell Carcinoma', 2: 'Benign Keratosis-like Lesions',
    3: 'Dermatofibroma', 4: 'Melanoma', 5: 'Melanocytic Nevi', 6: 'Vascular Lesions'
}

RECOMMENDATIONS = {
    'Actinic Keratoses': "Pre-cancerous scaling. Consult a dermatologist for cryotherapy or topical treatment.",
    'Basal Cell Carcinoma': "Common skin cancer. Requires surgical removal or biopsy. Visit a doctor promptly.",
    'Benign Keratosis-like Lesions': "Likely benign (e.g., age spots). Monitor for changes in size or color.",
    'Dermatofibroma': "Benign skin nodule. Usually harmless, but surgical removal is an option if bothersome.",
    'Melanoma': "Serious skin cancer. IMMEDIATE dermatologist consultation required for biopsy and treatment.",
    'Melanocytic Nevi': "Common mole. Usually benign. Watch for ABCDE signs (Asymmetry, Border, Color, Diameter, Evolving).",
    'Vascular Lesions': "Benign blood vessel growth. Aesthetic concern primarily, unless bleeding occurs.",
    'Unknown': "This condition is not recognized by our AI model. For your safety, please consult a certified dermatologist for a professional clinical examination.",
    'Disclaimer': "AI-based assessments are for informational purposes only and are NOT a substitute for professional medical advice, diagnosis, or treatment."
}

DOCTORS = [
    {"name": "Dr. Ramesh Kumar", "specialization": "Dermatologist", "city": "Bangalore", "hospital": "Manipal Hospital", "contact": "080 2502 4444"},
    {"name": "Dr. Priya Sharma", "specialization": "Skin Specialist", "city": "Bangalore", "hospital": "Victoria Hospital", "contact": "080 2670 1150"},
    {"name": "Dr. Arvind Hedge", "specialization": "Dermatologist", "city": "Mysore", "hospital": "JSS Hospital", "contact": "0821 233 5555"},
    {"name": "Dr. Sneha Rao", "specialization": "Skin Specialist", "city": "Mysore", "hospital": "Apollo BGS Hospital", "contact": "0821 256 8888"},
    {"name": "Dr. Karthik S", "specialization": "Dermatologist", "city": "Mangalore", "hospital": "KMC Hospital", "contact": "0824 244 5858"},
    {"name": "Dr. Meera Bai", "specialization": "Dermatologist", "city": "Chennai", "hospital": "Apollo Hospital Greams Road", "contact": "044 2829 3333"}
]

# Helper Functions
def load_json(filepath, default=[]):
    if not os.path.exists(filepath): return default
    try:
        with open(filepath, 'r') as f: return json.load(f)
    except: return default

def save_json(filepath, data):
    with open(filepath, 'w') as f: json.dump(data, f)

def log_prediction(prediction_data):
    preds = load_json(PREDICTIONS_FILE, [])
    preds.append({
        **prediction_data,
        "timestamp": datetime.now().isoformat()
    })
    save_json(PREDICTIONS_FILE, preds)

@app.route('/')
def home():
    return jsonify({"message": "AI Skin Disease Detection API is running.", "status": "Active" if model else "Model Error"})

@app.route('/doctors', methods=['GET'])
def get_doctors():
    city = request.args.get('city', '').capitalize()
    if not city:
        return jsonify(DOCTORS)
    filtered = [d for d in DOCTORS if d['city'] == city]
    return jsonify(filtered)

# Enhanced Industry Mapping
CLASS_DETAILS = {
    'Actinic Keratoses': {'risk': 'High', 'key': 'Actinic_Keratoses'},
    'Basal Cell Carcinoma': {'risk': 'High', 'key': 'Basal_Cell_Carcinoma'},
    'Benign Keratosis-like Lesions': {'risk': 'Low', 'key': 'Benign_Keratosis-like_Lesions'},
    'Dermatofibroma': {'risk': 'Low', 'key': 'Dermatofibroma'},
    'Melanoma': {'risk': 'High', 'key': 'Melanoma'},
    'Melanocytic Nevi': {'risk': 'Medium', 'key': 'Melanocytic_Nevi'},
    'Vascular Lesions': {'risk': 'Low', 'key': 'Vascular_Lesions'},
    'Unknown': {'risk': 'Uncertain', 'key': 'Inconclusive'}
}

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files: return jsonify({"error": "No file"}), 400
    file = request.files['file']
    if not model: return jsonify({"prediction": "Demo Mode", "confidence": 0.9, "status": "demo"})

    try:
        processed_image, message = prepare_image(file)
        if processed_image is None:
            return jsonify({"error": "Preprocessing error", "recommendation": message}), 422

        pred_array = model.predict(processed_image)
        class_idx = np.argmax(pred_array[0])
        confidence = float(np.max(pred_array[0]))

        # Confidence handling logic
        if confidence < 0.40:
            status = "uncertain"
            label = "Low Confidence / Uncertain"
            predicted_class = "Unknown"
        elif confidence < 0.70:
            status = "medium"
            label = "Moderate Confidence"
            predicted_class = CLASSES.get(class_idx, "Unknown")
        else:
            status = "high"
            label = "High Confidence Analysis"
            predicted_class = CLASSES.get(class_idx, "Unknown")

        details = CLASS_DETAILS.get(predicted_class, CLASS_DETAILS['Unknown'])
        
        result = {
            "prediction": predicted_class,
            "confidence": confidence,
            "confidence_label": label,
            "risk_level": details['risk'],
            "class_key": details['key'],
            "recommendation": RECOMMENDATIONS.get(predicted_class, RECOMMENDATIONS['Unknown']),
            "status": status
        }
        
        log_prediction(result)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    users = load_json(USERS_FILE, {})
    if data.get('username') in users: return jsonify({"error": "Exists"}), 400
    users[data.get('username')] = {"email": data.get('email'), "password": data.get('password')}
    save_json(USERS_FILE, users)
    return jsonify({"message": "Success"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    login_id = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if login_id == 'admin' and password == 'admin123':
        return jsonify({"username": "admin", "role": "admin", "email": "admin@derma.ai"}), 200

    users = load_json(USERS_FILE, {})
    for uname, udata in users.items():
        stored_email = udata.get('email', '').strip().lower()
        stored_uname = uname.strip().lower()
        
        if (stored_email == login_id or stored_uname == login_id) and udata.get('password') == password:
            return jsonify({
                "username": uname, 
                "role": "user", 
                "email": udata.get('email')
            }), 200

    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    feedbacks = load_json(FEEDBACK_FILE, [])
    feedbacks.append({**data, "date": str(np.datetime64('now'))})
    save_json(FEEDBACK_FILE, feedbacks)
    return jsonify({"message": "Success"}), 201

@app.route('/admin/feedback', methods=['GET'])
def get_feedback():
    return jsonify(load_json(FEEDBACK_FILE, []))

@app.route('/admin/feedback/delete', methods=['POST'])
def delete_feedback():
    date = request.json.get('date')
    feedbacks = load_json(FEEDBACK_FILE, [])
    new_feedbacks = [f for f in feedbacks if f.get('date') != date]
    if len(new_feedbacks) < len(feedbacks):
        save_json(FEEDBACK_FILE, new_feedbacks)
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Not found"}), 404

@app.route('/admin/stats', methods=['GET'])
def get_stats():
    users = load_json(USERS_FILE, {})
    feedback = load_json(FEEDBACK_FILE, [])
    predictions = load_json(PREDICTIONS_FILE, [])

    # Advanced Stats
    ratings = [f.get('rating', 0) for f in feedback]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    successful_preds = [p for p in predictions if p.get('status') in ['success', 'low_confidence']]
    avg_confidence = sum([p.get('confidence', 0) for p in successful_preds]) / len(successful_preds) if successful_preds else 0
    
    # Disease Distribution (Including Inconclusive)
    dist = {}
    for p in predictions:
        label = p.get('prediction', 'Unknown')
        dist[label] = dist.get(label, 0) + 1

    return jsonify({
        "totalUsers": len(users),
        "totalFeedback": len(feedback),
        "totalPredictions": len(predictions),
        "averageRating": round(avg_rating, 1),
        "averageConfidence": round(avg_confidence * 100, 1),
        "diseaseDistribution": dist,
        "ratingCounts": {str(i): ratings.count(i) for i in range(1, 6)}
    })

# Chatbot
CHATBOT_KNOWLEDGE = {
    "acne": "Treat with benzoyl peroxide or consult a doctor.",
    "eczema": "Use fragrance-free moisturizers and keep skin hydrated.",
    "melanoma": "Serious. See a dermatologist immediately if you see changing moles."
}

@app.route('/chatbot', methods=['POST'])
def chatbot():
    msg = request.json.get('message', '').lower()
    for k, v in CHATBOT_KNOWLEDGE.items():
        if k in msg: return jsonify({"response": v})
    return jsonify({"response": "I can help with Acne, Eczema, or Melanoma. What's your concern?"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
