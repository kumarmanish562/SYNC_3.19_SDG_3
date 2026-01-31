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

// WhatsApp Direct Webhook (Easier config)
app.post('/webhook', require('./controllers/whatsappController').handleWebhook);

// Serve static files if needed or handling uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Help user test if server is reachable from phone
app.get("/", (req, res) => res.send("CoughX Backend is Up and Running!"));

const os = require('os');
function getLocalIPs() {
    const addresses = [];
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Only consider IPv4 addresses that are not internal (loopback)
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

const PORT = process.env.PORT || 5000;
const IPs = getLocalIPs();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 SCAN SYNC Backend is running!`);
    console.log(`-------------------------------------------`);
    console.log(`🏠 Local Access: http://localhost:${PORT}`);

    if (IPs.length > 0) {
        console.log(`📱 Phone Access (Use one of these on your phone):`);
        IPs.forEach(ip => {
            console.log(`   👉 http://${ip}:${PORT}`);
        });
    } else {
        console.log(`⚠️  Warning: No local network IPs detected. Check Wi-Fi.`);
    }
    console.log(`-------------------------------------------\n`);
});
