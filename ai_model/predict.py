import sys
import os
import json
import numpy as np
import librosa
import tensorflow as tf
import tensorflow_hub as hub
import joblib

# Suppress TF warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

# =========================
# CONFIG
# =========================
SAMPLE_RATE = 16000
MAX_DURATION = 5  # seconds
MODEL_PATH = os.path.join(os.path.dirname(__file__), "tb_cough_model.pkl")

# =========================
# AUDIO PREPROCESSING
# =========================
def preprocess_audio(path):
    try:
        audio, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)
        audio = librosa.util.normalize(audio)

        max_len = SAMPLE_RATE * MAX_DURATION
        if len(audio) > max_len:
            audio = audio[:max_len]
        else:
            audio = np.pad(audio, (0, max_len - len(audio)))

        return audio.astype(np.float32)
    except Exception as e:
        print(json.dumps({"error": f"Error processing audio: {str(e)}"}))
        sys.exit(1)

# =========================
# LOAD MODELS
# =========================
def load_models():
    try:
        # Load YAMNet
        yamnet = hub.load("https://tfhub.dev/google/yamnet/1")
        
        # Load Classifier
        if not os.path.exists(MODEL_PATH):
            print(json.dumps({"error": f"Model file not found at {MODEL_PATH}"}))
            sys.exit(1)
            
        classifier = joblib.load(MODEL_PATH)
        return yamnet, classifier
    except Exception as e:
        print(json.dumps({"error": f"Error loading models: {str(e)}"}))
        sys.exit(1)

def extract_embedding(model, audio):
    scores, embeddings, spectrogram = model(audio)
    return tf.reduce_mean(embeddings, axis=0).numpy()

# =========================
# MAIN ARGUMENT HANDLING
# =========================
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file path provided"}))
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print(json.dumps({"error": f"Audio file not found at {audio_path}"}))
        sys.exit(1)

    # Load resources
    yamnet, classifier = load_models()

    # Process and Predict
    try:
        audio = preprocess_audio(audio_path)
        embedding = extract_embedding(yamnet, audio)
        
        # Predict Probability (Class 1 = TB)
        # embedding needs to be reshaped to (1, -1) for single sample prediction
        prob = classifier.predict_proba(embedding.reshape(1, -1))[0][1]
        
        # Generate result
        score = float(prob * 100)
        status = "Low Risk"
        if score > 70:
            status = "High Risk"
        elif score > 30:
            status = "Medium Risk"

        result = {
            "success": True,
            "score": round(score, 1),
            "status": status,
            "probability": prob
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": f"Prediction error: {str(e)}"}))
        sys.exit(1)
