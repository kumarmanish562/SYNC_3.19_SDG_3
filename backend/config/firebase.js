const admin = require("firebase-admin");
const path = require("path");

try {
    // 1. Construct path to serviceAccountKey.json
    // Ensure this file exists in your backend root!
    const serviceAccount = require("../serviceAccountKey.json");

    // 2. Initialize Firebase Admin SDK
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // IMP: Replace with your actual URLs from Firebase Console
        // databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
        // storageBucket: "your-project-id.appspot.com"
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    console.log("Firebase Admin Initialized Successfully");

} catch (error) {
    console.error("Firebase Admin Init Error:", error.message);
    console.error("Make sure 'serviceAccountKey.json' is present and .env has DB/Storage URLs.");
}

const db = admin.database(); // Realtime Database
const bucket = admin.storage().bucket(); // Cloud Storage
const auth = admin.auth(); // Authentication

module.exports = { admin, db, bucket, auth };
