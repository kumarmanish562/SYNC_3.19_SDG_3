const { db, bucket } = require("../config/firebase");
const fs = require("fs");

exports.analyzeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded" });
        }

        const userId = req.body.userId || "anonymous"; // Should come from auth middleware
        const localFilePath = req.file.path;
        const destination = `coughs/${userId}/${Date.now()}_${req.file.originalname}`;

        // 1. Upload to Firebase Storage
        let fileUrl = "";
        try {
            const [uploadedFile] = await bucket.upload(localFilePath, {
                destination: destination,
                metadata: {
                    contentType: req.file.mimetype,
                },
            });
            // Generate signed URL valid for 7 days (or make bucket public)
            const [url] = await uploadedFile.getSignedUrl({
                action: 'read',
                expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
            });
            fileUrl = url;
        } catch (uploadError) {
            console.error("Firebase Storage Upload Failed:", uploadError.message);
            // We continue even if upload fails, just to return analysis results
        }

        // 2. AI Analysis (Simulated for Hackathon/Demo)
        // Removed Hugging Face call. Using robust simulation logic.
        // In a real app, you would replace this block with your actual ML model inference (Python/TensorFlow)

        const mockRiskScore = Math.floor(Math.random() * 40) + 10;
        const status = mockRiskScore > 70 ? "High Risk" : (mockRiskScore > 30 ? "Medium Risk" : "Low Risk");

        // 3. Save Report to Realtime Database
        const reportRef = db.ref(`reports/${userId}`).push();
        await reportRef.set({
            score: mockRiskScore,
            status: status,
            audioUrl: fileUrl,
            // rawAnalysis: aiResult || null, // Removed
            timestamp: new Date().toISOString(),
            deviceInfo: req.body.deviceInfo || "unknown"
        });

        console.log("Report saved to database:", reportRef.key);

        // Cleanup local file
        try { fs.unlinkSync(localFilePath); } catch (e) { }

        res.json({
            success: true,
            data: {
                raw: null, // No raw AI data
                score: mockRiskScore,
                status: status,
                reportId: reportRef.key,
                timestamp: new Date().toISOString()
            }
        });

    } catch (err) {
        console.error("Analysis Error:", err);
        // Fallback for hackathon demo so app doesn't crash on API limits/errors
        res.json({
            success: true,
            data: {
                raw: null,
                score: Math.floor(Math.random() * 80),
                status: "Analysis Simulated (Fallback)",
                isFallback: true
            }
        });
    }
};
