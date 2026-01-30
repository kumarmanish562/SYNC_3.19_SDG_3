# SYNC CIH 3.0 CoughX - TB-SCAN

**Smart Tuberculosis Screening & Cough Analysis System**

## 📖 Overview

**CoughX (TB-SCAN)** is a mobile application designed to provide preliminary screening for Tuberculosis and other respiratory conditions through advanced cough audio analysis. The system combines a user-friendly React Native mobile frontend with a robust Node.js backend to capture, analyze, and track respiratory health data.

## ✨ Features

- **Authentication System**
  - Secure Login & Signup via Firebase.
  - OTP (One-Time Password) Verification for new registrations.
  - Support for user profiles and data persistence.

- **Cough Analysis**
  - Record audio samples directly within the app.
  - Upload recordings to the backend for analysis.
  - *Simulation Mode:* Currently returns detailed risk assessments (Low/Medium/High) and probability scores.

- **Real-time History & Tracking**
  - View past analysis reports with intuitive risk indicators.
  - Real-time updates for new screenings.
  - Filter and search through screening history.

- **User Dashboard**
  - Profile management with personal details.
  - Live account statistics (Total Screenings, Average Risk Level).
  - Visualization of health data.

- **Additional Utilities**
  - Nearby Clinics Locator.
  - Educational resources and medical disclaimers.

## 🛠 Tech Stack

### Frontend (Mobile App)
- **Framework:** React Native (via Expo SDK 50+)
- **Navigation:** React Navigation (Stack & Bottom Tabs)
- **State Management:** React Hooks & Context
- **Services:** Firebase Client SDK (Auth, Realtime Database), Axios
- **UI:** Custom Styles, Vector Icons

### Backend (API Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database & Storage:** Firebase Admin SDK (Realtime Database, Cloud Storage)
- **Utilities:** Multer (File Handling), Nodemailer (Email OTPs), CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app on your physical device (Android/iOS) or an Emulator.

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**Configuration:**
Create a `.env` file in the `backend/` directory with the following variables:
```env
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
# Ensure you have 'serviceAccountKey.json' in the backend root for Firebase Admin
```

Run the server:
```bash
node server.js
```
The server will start on `http://localhost:5000` (or your machine's IP).

### 2. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

**Configuration:**
Ensure the API URL in `src/services/api.js` points to your backend:
- **Emulator:** `http://10.0.2.2:5000/api`
- **Physical Device:** `http://<YOUR_PC_IP>:5000/api`

Run the Expo app:
```bash
npx expo start --clear
```
Scan the QR code with the **Expo Go** app on your phone.

## 📱 Usage Guide

1.  **Sign Up:** Create an account. You will receive an OTP via email (check backend console for mock mode if email service is not configured).
2.  **Record:** Go to the "Record" tab, grant microphone permissions, and record a cough sample.
3.  **Analyze:** Submit the recording. Wait for the analysis result.
4.  **Review:** Check the "History" tab to see all your past screenings.
5.  **Profile:** Visit the profile to see your aggregated health statistics.

## ⚠️ Medical Disclaimer
This application is a **screening tool** and does not provide a definitive medical diagnosis. Users are advised to consult with a qualified healthcare professional for further testing and treatment.

---
*Developed for SYNC CIH 3.0*
