const router = require("express").Router();
const nodemailer = require("nodemailer");
const { auth } = require("../config/firebase"); // Import shared auth instance

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// LOGIN / SIGNUP / GOOGLE AUTH
// Since we use Firebase on Frontend, we receive an ID TOKEN here to verify.
router.post("/verify-token", async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ success: false, message: "No token provided" });
    }

    try {
        // Verify the ID token sent from the client
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        const name = decodedToken.name || decodedToken.email.split('@')[0];

        // Here you would typically Create or Update user in your OWN SQL/Mongo database
        // const user = await db.findUser(uid); ...

        res.json({
            success: true,
            message: "User verified",
            user: { uid, email, name }
        });

    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
});

// In-memory OTP store (Use Redis for production)
const otpStore = {};

router.post("/send-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    // Generate 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`[OTP] Generated ${otp} for ${email}`);

    const mailOptions = {
        from: `TB-SCAN Support <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is: ${otp}`
    };

    try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: "OTP sent to email" });
        } else {
            console.log(`[Mock OTP] Code for ${email} is ${otp}`);
            res.json({ success: true, message: "OTP generated (Mock Mode check console)" });
        }
    } catch (error) {
        console.error("OTP Email Error:", error);
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;
    if (otpStore[email] === otp) {
        delete otpStore[email]; // Clear after use
        res.json({ success: true, message: "Verified" });
    } else {
        res.status(400).json({ success: false, message: "Invalid Code" });
    }
});

// Forgot Password Route
// Note: Firebase Client SDK handles password reset usually, but if you want custom email:
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    // With Firebase, you usually use: firebase.auth().sendPasswordResetEmail(email) on FRONTEND.
    // If you want to do it from backend via Admin SDK to generate link:
    try {
        const link = await auth.generatePasswordResetLink(email);

        // Send via Nodemailer
        const mailOptions = {
            from: `TB-SCAN Support <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            text: `Click here to reset your password: ${link}`
        };

        if (process.env.EMAIL_USER) {
            await transporter.sendMail(mailOptions);
            console.log(`[Email] Reset link sent to ${email}`);
            res.json({ success: true, message: "Reset link sent to your email" });
        } else {
            console.log(`[Email Mock] Would send link: ${link}`);
            res.json({ success: true, message: "Reset link generated (check server logs for link)" });
        }

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
