const router = require("express").Router();
const multer = require("multer");
const path = require("path");

const fs = require("fs");

// Ensure upload directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'cough-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const { analyzeAudio, getHistory, testModel } = require("../controllers/audioController");
const { handleWebhook } = require("../controllers/whatsappController");

router.post("/analyze", upload.single("audio"), analyzeAudio);
router.get("/history/:userId", getHistory);
router.get("/test-model", testModel);

// WhatsApp Webhook
router.post("/webhook", handleWebhook);

module.exports = router;
