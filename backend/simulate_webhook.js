const axios = require('axios');

async function run() {
    try {
        console.log("🚀 Starting WhatsApp Webhook Simulation...");
        console.log("-----------------------------------------");

        // This file exists in your uploads folder
        const localAudioUrl = "http://localhost:5000/uploads/cough-1769801439173.m4a";

        const payload = {
            messages: [{
                chat_id: '6265667534@s.whatsapp.net',
                from_me: false,
                type: 'voice',
                voice: {
                    link: localAudioUrl
                },
                timestamp: Math.floor(Date.now() / 1000)
            }]
        };

        console.log(`📤 Sending POST to http://localhost:5000/webhook`);
        console.log(`📦 Payload: Voice Note from 6265667534`);

        await axios.post('http://localhost:5000/webhook', payload);

        console.log("-----------------------------------------");
        console.log("✅ Webhook Sent Successfully!");
        console.log("👉 CHECK YOUR SERVER LOGS/TERMINAL for the analysis output.");
        console.log("-----------------------------------------");

    } catch (e) {
        console.error("❌ Simulation Failed:", e.message);
        if (e.code === 'ECONNREFUSED') {
            console.error("   Is the server running on port 5000?");
        }
    }
}
run();
