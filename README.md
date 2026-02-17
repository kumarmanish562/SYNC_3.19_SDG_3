# SwaaS - AI-Powered Respiratory Health & TB Screening

**Next-Generation Intelligence for Tuberculosis Screening & Clinical Analysis**

---

## 📖 Overview

**SwaaS** (Smart Wellness & Acoustic Analysis System) is a state-of-the-art AI-powered platform designed for early detection and monitoring of Tuberculosis and chronic respiratory conditions. Utilizing a unique **Hybrid Priority AI Architecture**, the system cross-references local pre-trained pathological models with Cloud-based Large Language Models (Gemini 1.5) to deliver clinical-grade risk assessments in seconds.

## ✨ Key Features

### 🧠 Hybrid Priority AI Engine (Dual-Core)
*   **Primary Screening (Local Model):** Highly optimized TensorFlow model (`predict.py`) that analyzes spectral audio features and YAMNet embeddings to provide a calibrated risk score.
*   **Advanced Refinement (Gemini 1.5):** Cloud-based AI provides deep clinical interpretation, detecting subtle pathological markers like stridor, wheezing, and hollow resonance.
*   **Zero-Tolerance Validation:** Intelligent noise-filtering that distinguishes human coughs from background interference, speech, or silence.

### 💬 WhatsApp Healthcare Bot
*   **Audio-to-Report:** Send a cough voice note directly to the SwaaS WhatsApp bot.
*   **Automated Analysis:** Real-time processing using the same Hybrid AI engine.
*   **Clinical PDF Delivery:** Receive a professional, standardized medical report (PDF) directly in the chat.
*   **Cloud Sync:** WhatsApp analyses are automatically synced to your SwaaS mobile app history.

### 📄 Professional Clinical Reports
*   **standardized PDF Format:** Automated generation of detailed assessment reports.
*   **Risk Dashboard:** Color-coded intensity indicators (Low/Medium/High).
*   **Actionable Advice:** Medical recommendations based on World Health Organization (WHO) screening protocols.

### 📱 Premium Mobile Experience
*   **Interactive Dashboard:** 14-day trend analysis and historical health tracking.
*   **Clinic Locator:** Interactive maps to find nearby respiratory clinics and hospitals.
*   **Secure Authentication:** Firebase-powered login with OTP verification for data privacy.

---

## 🛠 Technology Stack

### Frontend (User Interface)
*   **Framework:** React Native (Expo SDK 50+)
*   **Mapping:** React Native Maps with dynamic clinic discovery.
*   **Visuals:** Real-time audio waveform visualization.

### Backend (Intelligent Core)
*   **Runtime:** Node.js & Express.
*   **AI Stack:** 
    *   **Python:** TensorFlow, YAMNet, Librosa, Scipy.
    *   **Cloud:** Google Gemini 1.5 Flash (Generative AI).
*   **Integrations:** 
    *   **WhatsApp:** Whapi.cloud API for bot interactions.
    *   **Documentation:** PDFKit for clinical report generation.
*   **Database:** Firebase Realtime Database & Cloud Storage.

---

## 🚀 Installation & Setup

### 1. Backend Configuration
Navigate to `/backend`:
```bash
npm install
```

**Environment Setup (`.env`):**
```env
PORT=5000
# Firebase Configuration
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# AI APIs
GEMINI_API_KEY=your_gemini_key

# WhatsApp Bot
WHAPI_TOKEN=your_whapi_token
```

**Python AI Environment:**
```bash
pip install librosa tensorflow tensorflow_hub numpy soundfile joblib scipy
```

### 2. Frontend Configuration
Navigate to `/frontend`:
```bash
npm install
```

**Environment Setup (`.env`):**
```env
EXPO_PUBLIC_API_URL=http://<YOUR_LOCAL_IP>:5000/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_key
...
```

**Run Locally:**
```bash
npx expo start
```

---

## ⚠️ Medical Disclaimer
This platform is a **screening and educational tool**. It is **NOT** a substitute for professional medical diagnosis. The AI's findings provide a risk propensity based on acoustic patterns and should always be validated by a licensed physician through clinical tests (Sputum, X-Ray, etc.).

---
*Developed by Primanex Solutions - SYNC CIH 3.0*

hii
