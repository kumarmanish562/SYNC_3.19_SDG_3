import os
import numpy as np
import librosa
import tensorflow as tf
import tensorflow_hub as hub
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

# =========================
# CONFIG
# =========================
TB_DIR = "data/tb"
NON_TB_DIR = "data/non_tb"
SAMPLE_RATE = 16000
MAX_DURATION = 5  # seconds

# =========================
# AUDIO PREPROCESSING
# =========================
def preprocess_audio(path):
    audio, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)
    audio = librosa.util.normalize(audio)

    max_len = SAMPLE_RATE * MAX_DURATION
    if len(audio) > max_len:
        audio = audio[:max_len]
    else:
        audio = np.pad(audio, (0, max_len - len(audio)))

    return audio.astype(np.float32)

# =========================
# LOAD YAMNET (HeAR-style encoder)
# =========================
print("[INFO] Loading YAMNet model...")
yamnet = hub.load("https://tfhub.dev/google/yamnet/1")
print("[INFO] YAMNet loaded successfully.")

def extract_embedding(audio):
    scores, embeddings, spectrogram = yamnet(audio)
    return tf.reduce_mean(embeddings, axis=0).numpy()

# =========================
# BUILD DATASET
# =========================
X = []
y = []

print("[INFO] Processing TB-like coughs...")
for file in os.listdir(TB_DIR):
    if not file.lower().endswith(".wav"):
        continue
    path = os.path.join(TB_DIR, file)
    audio = preprocess_audio(path)
    emb = extract_embedding(audio)
    X.append(emb)
    y.append(1)

print("[INFO] Processing healthy coughs...")
for file in os.listdir(NON_TB_DIR):
    if not file.lower().endswith(".wav"):
        continue
    path = os.path.join(NON_TB_DIR, file)
    audio = preprocess_audio(path)
    emb = extract_embedding(audio)
    X.append(emb)
    y.append(0)

X = np.array(X)
y = np.array(y)

print(f"[INFO] Total samples: {len(y)}")

# =========================
# TRAIN CLASSIFIER
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("[INFO] Training Logistic Regression classifier...")
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)




# =========================
# DETAILED CLASS-WISE ANALYSIS
# =========================
print("\n[DETAILED ANALYSIS]")

tb_probs = []
non_tb_probs = []

for i in range(len(X_test)):
    prob = model.predict_proba(X_test[i].reshape(1, -1))[0][1]
    if y_test[i] == 1:
        tb_probs.append(prob)
    else:
        non_tb_probs.append(prob)

print(f"TB samples analysed: {len(tb_probs)}")
print(f"Non-TB samples analysed: {len(non_tb_probs)}")

print(f"Average TB risk score: {np.mean(tb_probs):.3f}")
print(f"Average Non-TB risk score: {np.mean(non_tb_probs):.3f}")




# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)
print("\n[RESULT] Classification Report:")
print(classification_report(y_test, y_pred))

# =========================
# SAVE MODEL
# =========================
joblib.dump(model, "tb_cough_model.pkl")
print("[INFO] Model saved as tb_cough_model.pkl")

# =========================
# TEST ON ONE SAMPLE
# =========================
test_file = os.path.join(TB_DIR, os.listdir(TB_DIR)[0])
test_audio = preprocess_audio(test_file)
test_emb = extract_embedding(test_audio)

prob = model.predict_proba(test_emb.reshape(1, -1))[0][1]
print(f"[DEMO] TB risk probability for sample: {prob:.3f}")
