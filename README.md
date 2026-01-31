# Swass - Smart Respiratory Health

**Next-Generation Tuberculosis Screening & Respiratory Analysis System**

## 📖 Overview

**Swass** is an advanced AI-powered mobile application designed to provide preliminary screening for Tuberculosis and other respiratory conditions. The system utilizes a novel **Ensemble AI Architecture**, combining on-device spectral analysis with Cloud-based Large Language Models (Gemini 1.5) to deliver highly accurate, real-time risk assessments.

## ✨ Key Features

### 🧠 Ensemble AI Engine (Dual-Core Analysis)
*   **Local Engine (Python/TensorFlow):** On-device spectral analysis using YamNet and custom classifiers to detect audio features.
*   **Cloud Engine (Google Gemini 1.5):** Generative AI analysis for context-aware cough classification and noise filtering.
*   **Balanced Scoring:** Findings from both engines are weighted (50/50) to produce a final, robust risk score.

### 🔬 Advanced Classification Categories
The system strictly categorizes audio inputs to avoid false positives:
*   **0% - Invalid:** Silence, background noise, or talking (No cough detected).
*   **2-20% - Low Risk:** Simple, dry, or tickle coughs (Normal/Allergy).
*   **30-60% - Medium Risk:** Productive, wet, or congested coughs (Cold/Flu).
*   **75-99% - High Risk:** Deep, hollow resonance, rattling, or persistent wheezing (Potential TB Signs).

### 📱 User-Centric Mobile Experience
*   **Smart Recording:** Integrated audio recorder with real-time waveform visualization.
*   **Instant Results:** Analysis is performed in seconds, with immediate visual feedback.
*   **Real-time History:** Past reports are automatically synced and updated across devices.
*   **Health Insights:** AI-generated trend suggestions based on historical data.

### 🔐 Security & Management
*   **Secure Auth:** Firebase Authentication with OTP verification.
*   **Privacy:** Audio is processed securely and deleted from local storage post-analysis.
*   **Profile Dashboard:** View aggregate health stats and manage personal information.

---

## 🛠 Technology Stack

### Frontend (Mobile)
*   **Framework:** React Native (Expo SDK 50+)
*   **Language:** JavaScript (ES6+)
*   **Navigation:** React Navigation (Stack, Bottom Tabs)
*   **State Analysis:** Live Waveform Visualization
*   **Styling:** Custom component system

### Backend (Intelligent Core)
*   **Runtime:** Node.js & Express
*   **AI Integration:**
    *   **Python Subsystem:** `librosa`, `tensorflow`, `numpy`, `soundfile` for spectral processing.
    *   **Cloud API:** Google Gemini 1.5 Flash for generative audio analysis.
*   **Database:** Firebase Realtime Database
*   **Storage:** Firebase Cloud Storage
*   **Process Management:** `child_process` spawning for seamless Python-Node interoperability.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python 3.10+ (with pip)
*   Expo Go app (Android/iOS)

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
npm install
```

**Python Dependencies:**
Ensure you have Python installed, then install the required AI libraries:
```bash
pip install librosa tensorflow tensorflow_hub numpy soundfile joblib scipy
```

**Environment Configuration:**
Create a `.env` file in `backend/`:
```env
PORT=5000
GEMINI_API_KEY=your_google_ai_key
# Firebase Admin SDK credentials (serviceAccountKey.json) must be present in root
```

**Start the Server:**
```bash
node server.js
```
The server will initialize `Firebase Admin`, check for the Python environment, and listen on `0.0.0.0:5000`.

### 2. Frontend Setup

Open a new terminal, navigate to the frontend:
```bash
cd frontend
npm install
```

**API Configuration:**
Update `src/services/api.js` with your machine's local IP address:
```javascript
export const API_BASE_URL = 'http://<YOUR_IP_ADDRESS>:5000/api';
```

**Launch App:**
```bash
npx expo start --clear
```
Scan the QR code with **Expo Go**.

---

## ⚠️ Medical Disclaimer
This application is a **screening, research, and educational tool**. It does **NOT** provide a definitive medical diagnosis. The "High Risk" status is an indicator to seek professional medical advice. Always consult with a qualified healthcare provider for testing and treatment.

---
*Developed by Primanex Solutions for SYNC CIH 3.0*
