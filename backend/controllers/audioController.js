const { db, bucket } = require("../config/firebase");
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

// Initialize SDK with explicit v1 for production stability
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

exports.analyzeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const userId = req.body.userId || "anonymous";
        const localFilePath = path.resolve(req.file.path); // Use Absolute Path
        const destination = `coughs/${userId}/${Date.now()}_${req.file.originalname}`;

        console.log(`Starting analysis for User: ${userId}, File: ${localFilePath}`);

        // 1. Upload to Firebase Storage
        let fileUrl = "";
        try {
            const [uploadedFile] = await bucket.upload(localFilePath, {
                destination: destination,
                metadata: { contentType: req.file.mimetype },
            });
            const [url] = await uploadedFile.getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            });
            fileUrl = url;
            console.log("File uploaded to Firebase:", fileUrl);
        } catch (uploadError) {
            console.error("Firebase Storage Upload Failed:", uploadError.message);
        }

        // Pre-check for FFmpeg (important for Windows users)
        let hasFFmpeg = false;
        try {
            const { execSync } = require('child_process');
            execSync('ffmpeg -version', { stdio: 'ignore' });
            hasFFmpeg = true;
        } catch (e) {
            hasFFmpeg = false;
        }

        // 2. Fetch History for Manual Trend Analysis
        let pastScores = [];
        try {
            const historyRef = db.ref(`reports/${userId}`).limitToLast(5);
            const snapshot = await historyRef.once('value');
            const historyData = snapshot.val();
            if (historyData) {
                pastScores = Object.values(historyData).map(h => h.score || 0);
            }
        } catch (hErr) {
            console.error("History fetch failed:", hErr);
        }

        // 3. Run Local AI Model (Python)
        let aiResult = { score: 0, status: "Pending", probability: 0, trendSuggestion: "", coughType: "Unknown" };

        const runGeminiModel = async (filePath, mimetype) => {
            const modelsToTry = [
                "gemini-3-flash-preview",
                "gemini-3-flash-lite-preview",
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-1.5-flash"
            ];
            let lastError;

            for (const modelId of modelsToTry) {
                try {
                    console.log(`Cloud Analysis (SDK v1): Trying ${modelId}...`);
                    const model = genAI.getGenerativeModel({ model: modelId });
                    const audioBuffer = fs.readFileSync(filePath);

                    // Map mimetypes correctly for Google AI
                    let gMime = mimetype;
                    if (filePath.endsWith('.mp3')) gMime = 'audio/mpeg';
                    else if (filePath.endsWith('.m4a')) gMime = 'audio/mpeg';
                    else if (filePath.endsWith('.3gp')) gMime = 'audio/3gpp';
                    else if (filePath.endsWith('.wav')) gMime = 'audio/wav';
                    else gMime = mimetype || 'audio/mpeg';

                    const result = await model.generateContent([
                        "Act as a strict medical screening AI. \nYour task: Analyze the audio for Tuberculosis (TB) risk.\n\nSTEP 1: IDENTIFY SOUND\n- Silence/Noise/Talking -> INVALID\n- Cough -> VALID\n\nIf the audio does NOT contain a clear cough, you MUST return status \"Invalid\".\n\nSTEP 2: CLASSIFY & SCORE (If Valid Cough)\n1. **Simple Cough** (Dry, clearing throat, brief, non-productive)\n   -> Score: 2-20 | Status: \"Low Risk\" | Type: \"Simple Cough\"\n\n2. **Productive Cough** (Loose, phlegmy, cold/flu symptoms)\n   -> Score: 30-60 | Status: \"Medium Risk\" | Type: \"Congested Cough\"\n\n3. **TB/Severe Cough** (Deep, hollow resonance, persistent rattling, 'wet' lung sounds)\n   -> Score: 75-99 | Status: \"High Risk\" | Type: \"Potential TB Signs\"\n\nReturn ONLY JSON:\n{ \"success\": true, \"score\": 0, \"status\": \"Invalid\", \"cough_type\": \"None\", \"probability\": 0.0, \"explanation\": \"...\" }",
                        {
                            inlineData: {
                                data: audioBuffer.toString("base64"),
                                mimeType: gMime
                            }
                        }
                    ]);

                    const responseText = result.response.text();
                    console.log("Raw Gemini Response:", responseText);
                    const jsonMatch = responseText.match(/\{.*\}/s);
                    if (jsonMatch) {
                        const parsed = JSON.parse(jsonMatch[0]);
                        console.log(`Gemini Analysis Successful with ${modelId}!`);
                        return {
                            success: true,
                            score: parsed.score || 0,
                            status: parsed.status || "Unknown",
                            cough_type: parsed.cough_type || parsed.type || "Unknown",
                            probability: parsed.probability || (parsed.score / 100),
                            explanation: parsed.explanation || ""
                        };
                    }
                } catch (err) {
                    console.warn(`Gemini SDK Model ${modelId} failed:`, err.message);
                    lastError = err;
                }
            }
            throw lastError || new Error("All Gemini models failed to analyze the audio.");
        };

        const runLocalModel = (filePath) => {
            return new Promise((resolve, reject) => {
                // Use 'python' which is standard in many envs, or try specific path if needed.
                const pythonCmd = process.platform === "win32" ? "python" : "python3";
                const scriptPath = path.resolve(__dirname, "../../ai_model/predict.py");

                console.log(`Executing Python: ${pythonCmd} ${scriptPath} ${filePath}`);

                const pythonProcess = spawn(pythonCmd, [scriptPath, filePath]);

                let output = "";
                let errorOutput = "";

                pythonProcess.stdout.on("data", (data) => {
                    output += data.toString();
                });

                pythonProcess.stderr.on("data", (data) => {
                    errorOutput += data.toString();
                    // Don't log every stderr chunk as it spams console with TF info
                });

                pythonProcess.on("close", (code) => {
                    // TF often writes to stderr even on success, so we check for output first
                    if (output.trim().length > 0) {
                        // proceed to parse
                    } else if (code !== 0) {
                        return reject(new Error(`Python process failed (Code ${code}). ${errorOutput}`));
                    }
                    try {
                        const trimmedOutput = output.trim();
                        // Find the last JSON block in case there are warnings/logs before it
                        const jsonMatch = trimmedOutput.match(/\{.*\}/s);
                        if (!jsonMatch) throw new Error("No JSON found in output");

                        const result = JSON.parse(jsonMatch[0]);
                        resolve(result);
                    } catch (e) {
                        reject(new Error(`Failed to parse AI result. Output: ${output}`));
                    }
                });
            });
        };

        try {
            let localRes = null;
            let geminiRes = null;
            const isWav = req.file.originalname.toLowerCase().endsWith('.wav');

            // 1. Attempt Local Model
            try {
                // Always try local model; predict.py has internal fallbacks (SoundFile/Wave)
                console.log(`Ensemble step 1: Running Local AI...`);
                localRes = await runLocalModel(localFilePath);
            } catch (e) {
                console.warn("Local AI execution failed:", e.message);
            }

            // 2. Attempt Gemini Model
            try {
                console.log(`Ensemble step 2: Running Gemini AI...`);
                geminiRes = await runGeminiModel(localFilePath, req.file.mimetype);
            } catch (e) {
                console.error("Gemini AI execution failed:", e.message);
            }

            // 3. Aggregate Results
            // Check for INVALID (Silence/Noise) from Gemini first
            if (geminiRes?.status === "Invalid") {
                aiResult = {
                    score: 0,
                    status: "Invalid Audio - No Cough Detected",
                    probability: 0,
                    coughType: "None",
                    explanation: geminiRes.explanation || "No cough sound detected. Please record again specifically capturing a cough."
                };
            } else if (localRes?.success && geminiRes?.success) {
                // Dual model ensemble (Balanced: 50% Local, 50% Gemini)
                let weightedScore = (localRes.score * 0.5) + (geminiRes.score * 0.5);

                aiResult = {
                    score: Math.round(weightedScore),
                    status: weightedScore >= 80 ? "High Risk" : (weightedScore >= 45 ? "Medium Risk" : "Low Risk"),
                    probability: ((localRes.probability || 0.85) + (geminiRes.probability || 0.85)) / 2,
                    coughType: geminiRes.cough_type || localRes.cough_type,
                    explanation: `Ensemble analysis: Local Model (${localRes.score}%) & Cloud AI (${geminiRes.score}%)`
                };
            } else if (geminiRes?.success) {
                // Only Gemini succeeded
                aiResult = {
                    score: geminiRes.score,
                    status: geminiRes.status,
                    probability: geminiRes.probability,
                    coughType: geminiRes.cough_type,
                    explanation: geminiRes.explanation + " (Cloud analysis exclusively)"
                };
            } else if (localRes?.success) {
                // Only Local succeeded
                aiResult = {
                    score: localRes.score,
                    status: localRes.status,
                    probability: localRes.probability,
                    coughType: localRes.cough_type,
                    explanation: "Analysis completed via on-device engine."
                };
            } else {
                // Both Failed
                const errorMsg = localRes?.error || geminiRes?.error || "All analytical engines failed to process audio.";
                try { fs.unlinkSync(localFilePath); } catch (e) { }
                return res.json({ success: false, error: errorMsg });
            }

            // 4. Trend Analysis
            let trend = "Baseline analysis complete. Future tests will track improvements.";
            if (pastScores.length > 0) {
                const avgPast = pastScores.reduce((a, b) => a + b, 0) / pastScores.length;
                const diff = aiResult.score - avgPast;
                if (diff > 12) trend = "Current analysis shows an increase in intensity compared to your previous tests.";
                else if (diff < -12) trend = "Significant improvement detected compared to your historical baseline.";
                else trend = "Your respiratory profile remains stable based on previous records.";
            }
            aiResult.trendSuggestion = trend;

        } catch (aiError) {
            console.error("Critical AI Error:", aiError.message);
            try { fs.unlinkSync(localFilePath); } catch (e) { }

            let userError = "AI Analysis Failed. Please try recording again.";
            if (aiError.message.includes("ModuleNotFoundError")) {
                userError = "AI environment missing dependencies. Please contact support.";
            } else if (aiError.message.includes("Error processing audio")) {
                userError = "Audio format not supported. Please ensure you are recording through the app.";
            }

            return res.json({ success: false, error: userError });
        }

        // 4. Save Report to Database
        const reportRef = db.ref(`reports/${userId}`).push();
        const timestamp = new Date().toISOString();
        await reportRef.set({
            score: aiResult.score,
            status: aiResult.status,
            trendSuggestion: aiResult.trendSuggestion,
            coughType: aiResult.coughType,
            explanation: aiResult.explanation || "Local analysis completed.",
            audioUrl: fileUrl,
            timestamp: timestamp,
            deviceInfo: req.body.deviceInfo || "unknown"
        });

        console.log("Analysis Complete. Result:", aiResult.status, `(${aiResult.score}%)`);

        // Cleanup
        try { fs.unlinkSync(localFilePath); } catch (e) { }

        res.json({
            success: true,
            data: {
                score: aiResult.score,
                status: aiResult.status,
                trendSuggestion: aiResult.trendSuggestion,
                coughType: aiResult.coughType,
                reportId: reportRef.key,
                timestamp: timestamp
            }
        });

    } catch (err) {
        console.error("Main Controller Error:", err);
        res.status(500).json({ success: false, error: "Critical Server Error" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID required" });
        }

        const reportsRef = db.ref(`reports/${userId}`);
        const snapshot = await reportsRef.once('value');
        const data = snapshot.val();

        if (!data) return res.json({ success: true, data: [] });

        const history = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
        }));

        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json({ success: true, data: history });

    } catch (error) {
        console.error("Get History Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch history" });
    }
};
exports.testModel = async (req, res) => {
    try {
        const scriptPath = path.resolve(__dirname, "../../ai_model/predict.py");
        const pythonProcess = spawn("py", ["-3", scriptPath, "test.wav"]);
        let output = "";
        pythonProcess.stdout.on("data", (data) => output += data.toString());
        pythonProcess.on("close", (code) => {
            res.json({ success: true, message: "Python script is reachable", output });
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};
