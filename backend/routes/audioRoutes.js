const router = require("express").Router();
const multer = require("multer");
const path = require("path");

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, 'cough-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const { analyzeAudio, getHistory } = require("../controllers/audioController");

router.post("/analyze", upload.single("audio"), analyzeAudio);
router.get("/history/:userId", getHistory);

module.exports = router;
