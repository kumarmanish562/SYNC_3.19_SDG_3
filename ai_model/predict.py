import sys
import os
import json
import numpy as np
import librosa
import tensorflow as tf
import tensorflow_hub as hub
import joblib
import warnings
import traceback

# Suppress warnings
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 

SAMPLE_RATE = 16000
MAX_DURATION = 5 
MODEL_PATH = os.path.join(os.path.dirname(__file__), "tb_cough_model.pkl")

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer): return int(obj)
        if isinstance(obj, np.floating): return float(obj)
        if isinstance(obj, np.ndarray): return obj.tolist()
        return super(NpEncoder, self).default(obj)

def safe_json_print(data):
    try:
        print(json.dumps(data, cls=NpEncoder))
    except:
        print('{"success": false, "error": "Internal Output Error"}')

def load_models():
    try:
        yamnet = hub.load("https://tfhub.dev/google/yamnet/1")
        if not os.path.exists(MODEL_PATH):
            return None, None, f"Model file missing at {MODEL_PATH}"
        classifier = joblib.load(MODEL_PATH)
        return yamnet, classifier, None
    except Exception as e:
        return None, None, str(e)

def preprocess_audio(path):
    try:
        if not os.path.exists(path):
             raise FileNotFoundError(f"Audio file not found: {path}")

        audio, sr = None, 0
        
        # Priority 1: Soundfile (Most robust for WAV)
        try:
            import soundfile as sf
            data, sr = sf.read(path)
            if len(data.shape) > 1: data = np.mean(data, axis=1)
            audio = data.astype(np.float32)
            if sr != SAMPLE_RATE:
                audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
        except:
            audio = None

        # Priority 2: Built-in Wave module (Last resort for PCM)
        if audio is None:
            try:
                import wave
                with wave.open(path, 'rb') as wf:
                    n_channels = wf.getnchannels()
                    sampwidth = wf.getsampwidth()
                    framerate = wf.getframerate()
                    n_frames = wf.getnframes()
                    raw_data = wf.readframes(n_frames)
                    if sampwidth == 2:
                        audio = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32) / 32768.0
                        if n_channels > 1: audio = audio.reshape(-1, n_channels).mean(axis=1)
                        if framerate != SAMPLE_RATE:
                            audio = librosa.resample(audio, orig_sr=framerate, target_sr=SAMPLE_RATE)
            except:
                audio = None

        # Priority 3: Librosa (needs FFmpeg)
        if audio is None:
            # Note: For non-WAV files on Windows WITHOUT FFmpeg, this will throw the error
            # that triggers the Gemini fallback in audioController.js
            audio, sr = librosa.load(path, sr=SAMPLE_RATE, mono=True)
        
        # Post-processing
        audio = librosa.util.normalize(audio)
        
        # Ensure we have some sound
        if np.max(np.abs(audio)) < 0.0001:
             raise Exception("The recording is completely silent. Please try again.")

        max_len = SAMPLE_RATE * MAX_DURATION
        if len(audio) > max_len:
            audio = audio[:max_len]
        else:
            audio = np.pad(audio, (0, max_len - len(audio)))

        return audio.astype(np.float32)
    except Exception as e:
        err_msg = str(e)
        if not err_msg or "No backend" in err_msg or "audioread" in err_msg or "SoundFile" in err_msg or "WAVE" in err_msg:
             raise Exception("Format Error: Windows backend missing.")
        raise e

if __name__ == "__main__":
    try:
        if len(sys.argv) < 2:
            safe_json_print({"success": False, "error": "No audio path"})
            sys.exit(0)

        audio_path = sys.argv[1]
        yamnet, classifier, load_err = load_models()
        if load_err:
            safe_json_print({"success": False, "error": f"AI Engine Load Error: {load_err}"})
            sys.exit(0)

        audio = preprocess_audio(audio_path)
        
        # Neural Analysis
        scores, embeddings, spectrogram = yamnet(audio)
        mean_embedding = np.mean(embeddings, axis=0)
        
        # Output result
        prob = classifier.predict_proba(mean_embedding.reshape(1, -1))[0][1]
        score = float(prob * 100)
        status = "High Risk" if score > 80 else ("Medium Risk" if score > 45 else "Low Risk")

        cent = librosa.feature.spectral_centroid(y=audio, sr=SAMPLE_RATE)[0]
        mean_cent = float(np.mean(cent))
        cough_type = "Dry" if mean_cent > 1150 else "Productive (Wet)"

        safe_json_print({
            "success": True,
            "score": round(score, 1),
            "status": status,
            "probability": prob,
            "cough_type": cough_type,
            "diagnostics": {"rms": float(np.sqrt(np.mean(audio**2)))}
        })

    except Exception as e:
        safe_json_print({"success": False, "error": str(e)})
        sys.exit(0)
