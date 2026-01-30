import axios from "axios";
import { Platform } from "react-native";

// NOTE: If using Android Emulator, use 'http://10.0.2.2:5000/api'
// If using physical device, use your machine's LAN IP, e.g., 'http://192.168.1.X:5000/api'
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000/api";

export const analyzeCough = async (audioUri) => {
    try {
        const formData = new FormData();

        const filename = audioUri.split('/').pop();
        const fileType = filename.split('.').pop();

        formData.append("audio", {
            uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
            name: `cough.${fileType}`,
            type: `audio/${fileType}`
        });

        console.log("Uploading to:", `${API_URL}/audio/analyze`);

        const res = await axios.post(
            `${API_URL}/audio/analyze`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                timeout: 10000 // 10s timeout
            }
        );

        return res.data;
    } catch (error) {
        console.error("API Error:", error);
        // Fallback for demo if backend not reachable
        return {
            success: false,
            data: {
                score: Math.floor(Math.random() * 80),
                status: "Analysis Failed (Offline Mode)"
            }
        };
    }
};

export const sendOtp = async (email) => {
    try {
        console.log("Sending OTP API call to:", `${API_URL}/auth/send-otp`);
        const res = await axios.post(`${API_URL}/auth/send-otp`, { email });
        return res.data;
    } catch (error) {
        console.error("OTP Error:", error);
        throw error;
    }
};

export const verifyOtp = async (email, otp) => {
    try {
        console.log("Verifying OTP API call...");
        const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        return res.data;
    } catch (error) {
        console.error("Verify Error:", error);
        throw error;
    }
};
