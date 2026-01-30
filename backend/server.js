const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/audio", require("./routes/audioRoutes"));
app.use("/api/auth", require("./routes/authRoutes")); // Placeholder for future auth

// Serve static files if needed or handling uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
