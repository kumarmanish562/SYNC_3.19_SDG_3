const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const PDFDocument = require('pdfkit');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);
const { spawn } = require('child_process');
const path = require('path');
const { db } = require('../config/firebase');

const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_URL = 'https://gate.whapi.cloud';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

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
        // A. Download from Whapi
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

        // B. Convert to WAV (16k Mono) for Local Model
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat('wav')
                .audioChannels(1)
                .audioFrequency(16000)
                .on('end', resolve)
                .on('error', reject)
                .save(wavPath);
        });

        // C. Hybrid AI Analysis (Local + Cloud)
        console.log(`Starting Hybrid Analysis for WhatsApp User: ${userName}`);

        // 1. Local Model Helper
        const runLocalModel = (filePath) => {
            return new Promise((resolve, reject) => {
                const pythonCmd = process.platform === "win32" ? "python" : "python3";
                const scriptPath = path.resolve(__dirname, "../../ai_model/predict.py");
                const pythonProcess = spawn(pythonCmd, [scriptPath, filePath]);
                let output = "";
                pythonProcess.stdout.on("data", (d) => output += d.toString());
                pythonProcess.on("close", (code) => {
                    try {
                        const jsonMatch = output.trim().match(/\{.*\}/s);
                        if (!jsonMatch) throw new Error("No JSON");
                        resolve(JSON.parse(jsonMatch[0]));
                    } catch (e) { reject(e); }
                });
            });
        };

        // 2. Gemini Cloud Helper
        const runGeminiModel = async (filePath) => {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const audioBuffer = fs.readFileSync(filePath);
            const result = await model.generateContent([
                `Act as a professional Clinical Acoustic Diagnostic AI specializing in respiratory pathology. 
Your primary goal is to screen for Tuberculosis (TB) based on cough audio characteristics with high specificity.

RESPONSE FORMAT (JSON ONLY):
{
  "success": true,
  "score": [Integer 0-99],
  "status": "Invalid" | "Low Risk" | "Medium Risk" | "High Risk",
  "cough_type": "Dry" | "Wet" | "Pathological",
  "probability": [Float],
  "explanation": "Briefly state why it is or isn't pathological."
}`,
                { inlineData: { data: audioBuffer.toString("base64"), mimeType: "audio/wav" } }
            ]);
            const text = result.response.text();
            const jsonMatch = text.match(/\{.*\}/s);
            return JSON.parse(jsonMatch[0]);
        };

        // Execute in Parallel
        const [localRes, geminiRes] = await Promise.all([
            runLocalModel(wavPath).catch(e => ({ success: false, error: e.message })),
            runGeminiModel(wavPath).catch(e => ({ success: false, error: e.message }))
        ]);

        // Hybrid Aggregation (Same as App)
        let aiResult = {
            score: localRes.success ? localRes.score : (geminiRes.score || 0),
            status: localRes.success ? localRes.status : (geminiRes.status || "Unknown"),
            probability: localRes.success ? localRes.probability : (geminiRes.probability || 0),
            cough_type: geminiRes.cough_type || localRes.cough_type || "Developing",
            explanation: `Clinical Screening (Trained Model): ${localRes.status}. \n\nAdvanced Refinement (Gemini AI): ${geminiRes.explanation}`
        };

        // D. Create & Send Report
        const pdfPath = path.resolve(__dirname, `../uploads/SwaaS_Report_${Date.now()}.pdf`);
        await createPDF(pdfPath, aiResult, userId, userName);

        await sendDocument(sender, pdfPath, "SwaaS_Analysis_Report.pdf");

        // UI Feedback
        if (aiResult.score > 70) {
            await sendMessage(sender, "⚠️ HIGH RISK detected. Please consult a doctor immediately. I've attached your standard clinical report.");
        } else {
            await sendMessage(sender, `✅ Analysis Complete. Risk: ${aiResult.score}%. Your detailed report is attached below.`);
        }

        // E. Save to Firebase History (Link to app history)
        try {
            const reportRef = db.ref(`reports/${userId}`).push();
            await reportRef.set({
                ...aiResult,
                timestamp: new Date().toISOString(),
                source: "WhatsApp"
            });
        } catch (dbErr) { console.error("History save failed:", dbErr.message); }

        // Cleanup
        try { fs.unlinkSync(inputPath); fs.unlinkSync(wavPath); fs.unlinkSync(pdfPath); } catch (e) { }

    } catch (e) {
        console.error("Processing flow failed", e);
        await sendMessage(sender, "❌ Sorry, I encountered an error processing your audio. Please try again with a clearer recording.");
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
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50,
            info: { Title: 'SwaaS Health Report', Author: 'SwaaS AI' }
        });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // --- Professional Header ---
        doc.rect(0, 0, 595.28, 70).fill('#1565C0'); // Deep Medical Blue
        doc.fillColor('#FFFFFF');
        doc.fontSize(22).font('Helvetica-Bold').text('SwaaS Health AI', 50, 25);
        doc.fontSize(10).font('Helvetica').text('CONFIDENTIAL CLINICAL ASSESSMENT', 50, 48);
        doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, 400, 35, { align: 'right' });

        // --- Metadata Section ---
        doc.moveDown(4);
        doc.fillColor('#333333');
        doc.fontSize(11).font('Helvetica-Bold').text('PATIENT INFORMATION');
        doc.rect(50, 105, 495, 1).fill('#E0E0E0');

        doc.font('Helvetica').fontSize(10);
        doc.text('Name:', 50, 120);
        doc.font('Helvetica-Bold').text(userName, 130, 120);
        doc.font('Helvetica').text('Patient ID:', 50, 135);
        doc.text(userId.slice(-8).toUpperCase(), 130, 135);
        doc.text('Sample ID:', 300, 120);
        doc.text(`AUDIO-${Date.now().toString().slice(-6)}`, 370, 120);

        // --- Risk Summary Dashboard ---
        doc.moveDown(4);
        const riskColor = data.score > 70 ? '#D32F2F' : (data.score > 40 ? '#F57C00' : '#2E7D32');
        const riskLabel = data.status.toUpperCase();

        doc.rect(50, 175, 495, 90).fill('#F8F9FA'); // Light Dashboard Bg
        doc.rect(50, 175, 5, 90).fill(riskColor); // Intensity line

        doc.fillColor('#666666').fontSize(9).font('Helvetica-Bold').text('ANALYSIS RESULT', 70, 185);
        doc.fillColor(riskColor).fontSize(28).font('Helvetica-Bold').text(riskLabel, 70, 205);
        doc.fillColor('#333333').fontSize(16).text(`${data.score}%`, 450, 205, { align: 'right', width: 80 });
        doc.fontSize(9).font('Helvetica').text('Risk Propensity', 450, 225, { align: 'right', width: 80 });

        // --- Clinical Breakdown ---
        doc.moveDown(4);
        doc.fontSize(11).font('Helvetica-Bold').text('CLINICAL FINDINGS', 50, 285);
        doc.rect(50, 298, 495, 1).fill('#E0E0E0');

        doc.fontSize(10).font('Helvetica-Bold').text('Cough Classification:', 50, 315);
        doc.font('Helvetica').text(data.cough_type || 'Unspecified', 180, 315);
        doc.font('Helvetica-Bold').text('AI Confidence:', 50, 335);
        doc.font('Helvetica').text(`${Math.round((data.probability || 0) * 100)}% Match`, 180, 335);

        // --- AI Interpretation ---
        doc.moveDown(3);
        doc.fontSize(11).font('Helvetica-Bold').text('AI INTERPRETATION & REASONING', 50, 375);
        doc.rect(50, 390, 495, 120).stroke('#EEEEEE');
        doc.font('Helvetica').fontSize(10).fillColor('#444444').text(data.explanation || "Primary acoustic analysis complete.", 65, 405, {
            width: 465,
            align: 'justify',
            lineGap: 3
        });

        // --- Recommendations ---
        doc.moveDown(4);
        doc.fillColor('#333333').fontSize(11).font('Helvetica-Bold').text('NEXT STEPS & ADVICE', 50, 540);
        doc.font('Helvetica').fontSize(10);
        if (data.score > 70) {
            doc.fillColor('#D32F2F').text('• URGENT: Seek medical consultation immediately.', 50, 560);
            doc.text('• Consider chest X-ray and sputum tests as directed by a doctor.', 50, 575);
        } else if (data.score > 35) {
            doc.text('• Monitor respiratory symptoms for the next 72 hours.', 50, 560);
            doc.text('• Re-test if symptoms (fever, night sweats) persist.', 50, 575);
        } else {
            doc.text('• Current profile is consistent with healthy respiratory patterns.', 50, 560);
            doc.text('• General hygiene and hydration advised.', 50, 575);
        }

        // --- Footer & Disclaimer ---
        doc.rect(0, 780, 595.28, 62).fill('#F5F5F5');
        doc.fontSize(8).fillColor('#888888').font('Helvetica');
        const disclaimer = "MEDICAL DISCLAIMER: This report is generated by an automated AI screening system and is NOT a definitive diagnosis. Acoustic signals are used to estimate risk based on clinical patterns. Final clinical decisions must be made by a licensed healthcare professional.";
        doc.text(disclaimer, 50, 792, { align: 'center', width: 495 });
        doc.text('© 2026 SwaaS Health AI - Standard Assessment Protocol', 0, 818, { align: 'center', width: 595 });

        doc.end();
        stream.on('finish', resolve);
    });
}
