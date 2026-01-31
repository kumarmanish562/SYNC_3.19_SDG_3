const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
require("dotenv").config();

// Initialize only if not already initialized (though in a new process it won't be)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();

async function run() {
    try {
        console.log("⚙️  Seeding Test User for WhatsApp...");
        // Creating a dummy user linked to the provided number
        await db.ref('users/test_user_simulate').set({
            name: "Simulation User",
            email: "simulate@swass.ai",
            whatsapp: "6265667534",
            createdAt: new Date().toISOString()
        });
        console.log("✅ User Linked! [test_user_simulate] <-> [6265667534]");
    } catch (e) {
        console.error("❌ Seeding Failed:", e.message);
    }
    process.exit(0);
}
run();
