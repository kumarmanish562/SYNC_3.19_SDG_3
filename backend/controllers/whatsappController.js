const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const PDFDocument = require('pdfkit');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const { spawn } = require('child_process');
const path = require('path');
const { db } = require('../config/firebase');

const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_URL = 'https://gate.whapi.cloud';

// Mapping: Sender ID (Phone) -> Internal User ID (from manual linking in app)
// For now, we will store/retrieve this link from Firebase under 'users/{uid}/whatsapp'

exports.handleWebhook = async (req, res) => {
    try {
        const message = req.body.messages?.[0];
        if (!message || message.from_me) return res.sendStatus(200);

        const sender = message.chat_id; // format: 1234567890@s.whatsapp.net
        const senderPhone = sender.split('@')[0];
        console.log(`📩 Webhook received from: ${senderPhone}`);

        // 1. Check if this WhatsApp number is linked to a registered user
        const userSnapshot = await db.ref('users').orderByChild('whatsapp').equalTo(senderPhone).once('value');
        let userData = null;
        let userId = null;

        if (userSnapshot.exists()) {
            const users = userSnapshot.val();
            userId = Object.keys(users)[0];
            userData = users[userId];
        } else {
            // Not linked: Send instructions
            await sendMessage(sender, "⚠️ Number not linked. Please login to the Swass App, click the WhatsApp icon on Home, and link your number first.");
            return res.sendStatus(200);
        }

        // 2. Handle Text: "Link Me" (Just in case user tries to interact manually)
        if (message.type === 'text') {
            await sendMessage(sender, `Hello ${userData.name || 'User'}! Please send a voice note or audio recording of a cough to begin analysis.`);
        }

        // 3. Handle Audio
        if (message.type === 'audio' || message.type === 'voice') {
            await sendMessage(sender, "🎙️ Audio received. Analyzing cough sample... This may take a moment.");

            console.log("Audio Message Payload:", JSON.stringify(message, null, 2)); // Debug log
            let mediaUrl = message.audio?.link || message.voice?.link;

            // Fallback: If no direct link, try fetching the message again (sometimes link generates after seconds)
            if (!mediaUrl) {
                console.log("⏳ Link missing. Waiting 2s and fetching message details...");
                await new Promise(r => setTimeout(r, 2000));

                try {
                    const msgRes = await axios.get(`${WHAPI_URL}/messages/${message.id}`, {
                        headers: { Authorization: `Bearer ${process.env.WHAPI_TOKEN}` }
                    });
                    const updatedMsg = msgRes.data?.messages?.[0];
                    mediaUrl = updatedMsg?.audio?.link || updatedMsg?.voice?.link;
                } catch (fetchErr) {
                    console.error("Failed to fetch message details:", fetchErr.message);
                }
            }

            if (!mediaUrl) {
                console.error("❌ Still no audio link found after fetch.");
                await sendMessage(sender, "⚠️ System Error: Audio link not provided. Please enable 'Auto Download' in your Whapi Dashboard Settings.");
                return res.sendStatus(200);
            }

            await processAudioAndReply(sender, userId, mediaUrl, userData?.username || 'Guest');
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error);
        res.sendStatus(500);
    }
};

async function processAudioAndReply(sender, userId, url, userName) {
    const inputPath = path.resolve(__dirname, `../uploads/whapi_${Date.now()}.ogg`);
    const wavPath = inputPath.replace('.ogg', '.wav');

    try {
        // A. Download
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: { Authorization: `Bearer ${process.env.WHAPI_TOKEN}` }
        });
        const writer = fs.createWriteStream(inputPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // B. Convert to WAV (16k Mono)
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
                .on('end', resolve)
                .on('error', reject)
                .save(wavPath);
        });

        // C. Run Core AI Logic (Importing logic from audioController if possible, or spawning python)
        // NOTE: We should ideally reuse the exact same Ensemble logic.
        // For speed in this specific file, we will spawn the Python script directly, 
        // BUT to get the "Ensemble" result we would need to replicate the Gemini call here or refactor audioController.
        // Let's spawn local predict.py first for reliability.

        const pythonCmd = process.platform === "win32" ? "python" : "python3";
        const scriptPath = path.resolve(__dirname, "../../ai_model/predict.py");

        const pythonProcess = spawn(pythonCmd, [scriptPath, wavPath]);
        let output = "";

        pythonProcess.stdout.on("data", (data) => output += data.toString());

        pythonProcess.on("close", async (code) => {
            // Parse Output
            try {
                const jsonMatch = output.trim().match(/\{.*\}/s);
                let aiResult = {};
                if (jsonMatch) {
                    aiResult = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("No JSON from AI");
                }

                // Generate PDF
                const pdfPath = path.resolve(__dirname, `../uploads/Report_${userId}_${Date.now()}.pdf`);
                await createPDF(pdfPath, aiResult, userId, userName);

                // Send PDF
                await sendDocument(sender, pdfPath, "📄 Swass Health Report.pdf");

                // High Risk Action
                if (aiResult.score > 70) {
                    await sendMessage(sender, "⚠️ High Risk Detected. We recommend visiting a clinic immediately.");
                    // Interactive buttons code would go here
                } else {
                    await sendMessage(sender, `✅ Analysis Complete. Risk Score: ${aiResult.score}%. Detailed report attached.`);
                }

                // Cleanup
                try { fs.unlinkSync(inputPath); fs.unlinkSync(wavPath); fs.unlinkSync(pdfPath); } catch (e) { }

            } catch (aiErr) {
                await sendMessage(sender, "❌ Analysis failed. Please try recording again clearly.");
            }
        });

    } catch (e) {
        console.error("Processing flow failed", e);
        await sendMessage(sender, "Server error processing your file.");
    }
}

async function sendMessage(to, text) {
    try {
        await axios.post(`${WHAPI_URL}/messages/text`, {
            to: to,
            body: text
        }, { headers: { Authorization: `Bearer ${process.env.WHAPI_TOKEN}` } });
    } catch (e) {
        console.error("Whapi Send Text Error", e.message);
    }
}

async function sendDocument(to, filePath, fileName) {
    try {
        const formData = new FormData();
        formData.append('to', to);
        formData.append('media', fs.createReadStream(filePath), { filename: fileName });

        await axios.post(`${WHAPI_URL}/messages/document`, formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${process.env.WHAPI_TOKEN}`
            }
        });
    } catch (e) {
        console.error("Whapi Send Doc Error", e.message);
    }
}

function createPDF(filePath, data, userId, userName) {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- Header ---
        doc.rect(0, 0, 612, 100).fill(data.score > 50 ? '#FFEBEE' : '#E8F5E9'); // Light background based on risk
        doc.fillColor('#333333');
        doc.fontSize(28).font('Helvetica-Bold').text('SwaaS', 50, 40, { align: 'left' });
        doc.fontSize(10).font('Helvetica').text('AI-Powered Tuberculosis Screening', 50, 75);

        doc.fontSize(12).text(new Date().toLocaleString(), 400, 45, { align: 'right' });
        doc.moveDown(4);

        // --- Patient Info ---
        doc.font('Helvetica-Bold').fontSize(16).text('Analysis Report', 50, 130);
        doc.rect(50, 150, 512, 2).fill('#E0E0E0');

        doc.font('Helvetica').fontSize(12).text(`Patient Name: ${userName}`, 50, 170);
        doc.text(`User ID: ${userId}`, 50, 190);
        doc.text(`Sample ID: ${Date.now()}`, 300, 190);

        // --- Risk Result Box ---
        const boxColor = data.score > 70 ? '#D32F2F' : (data.score > 40 ? '#F57C00' : '#388E3C');
        const boxBg = data.score > 70 ? '#FFCDD2' : (data.score > 40 ? '#FFCC80' : '#C8E6C9');

        doc.rect(50, 230, 512, 100).fill(boxBg);
        doc.fillColor(boxColor);
        doc.fontSize(20).font('Helvetica-Bold').text(data.status.toUpperCase(), 0, 250, { align: 'center', width: 612 });

        doc.fillColor('#000000');
        doc.fontSize(14).font('Helvetica').text(`Risk Score: ${data.score}/100`, 0, 280, { align: 'center', width: 612 });

        // --- Analysis Details ---
        doc.moveDown(5);
        doc.text('', 50, 360); // Reset position
        doc.font('Helvetica-Bold').fontSize(14).text('Clinical Analysis');
        doc.moveDown(1);

        // Table-like structure
        const drawRow = (label, value, y) => {
            doc.font('Helvetica-Bold').text(label, 50, y);
            doc.font('Helvetica').text(value, 200, y);
        };

        drawRow('Acoustic Classification:', data.cough_type || 'Unspecified', 390);
        drawRow('AI Confidence:', `${Math.round((data.probability || 0) * 100)}% Match`, 415);
        drawRow('Trend Analysis:', 'Single sample point', 440);

        // --- Visual Confidence Bar ---
        doc.rect(200, 418, 200, 8).fill('#EEEEEE'); // Track
        doc.rect(200, 418, 200 * (data.probability || 0), 8).fill(boxColor); // Fill

        // --- Explanation ---
        doc.moveDown(4);
        doc.fontSize(12).font('Helvetica-Bold').text('Interpretation');
        doc.font('Helvetica').fontSize(11).text(data.explanation || "No specific details provided.", { align: 'justify', width: 500 });

        // --- Disclaimer ---
        doc.moveDown(4);
        doc.rect(50, 650, 512, 60).stroke('#999999');
        doc.fontSize(9).fillColor('#666666')
            .text('MEDICAL DISCLAIMER: This report is generated by an automated Artificial Intelligence system ' +
                'and is NOT a medical diagnosis. The risk score indicates the similarity of your cough audio features ' +
                'to known clinical patterns. Please consult a qualified healthcare professional for validation.',
                60, 660, { width: 490, align: 'center' });

        doc.end();
        stream.on('finish', resolve);
    });
}
