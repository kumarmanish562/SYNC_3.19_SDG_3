import axios from "axios";
import { Platform } from "react-native";

// NOTE: If using Android Emulator, use 'http://10.0.2.2:5000/api'
// If using physical device, use your machine's LAN IP, e.g., 'http://192.168.1.X:5000/api'
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.2.127:5000/api";

export const analyzeCough = async (audioUri, userId, fileMetadata = {}) => {
    try {
        const formData = new FormData();

        let filename = fileMetadata.name;
        let fileType = fileMetadata.type;

        if (!filename) {
            filename = audioUri.split('/').pop();
        }
        if (!fileType) {
            const ext = filename.split('.').pop();
            fileType = `audio/${ext === filename ? 'm4a' : ext}`;
        }

        formData.append("audio", {
            uri: Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri,
            name: filename,
            type: fileType
        });

        if (userId) {
            formData.append("userId", userId);
        }

        console.log("Uploading to:", `${API_URL}/audio/analyze`);

        const res = await axios.post(
            `${API_URL}/audio/analyze`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                timeout: 60000 // 60s timeout for local AI model processing
            }
        );

        return res.data;
    } catch (error) {
        console.error("API Error Detailed:", {
            message: error.message,
            code: error.code,
            config: error.config?.url,
            status: error.response?.status
        });

        // Fallback for demo if backend not reachable
        return {
            success: false,
            error: `Connection Failed: ${error.message}. Ensure phone and PC are on the same Wi-Fi.`
        };
    }
};

export const fetchHistory = async (userId) => {
    try {
        console.log("Fetching history for:", userId);
        const res = await axios.get(`${API_URL}/audio/history/${userId}`);
        return res.data;
    } catch (error) {
        console.error("History Error:", error);
        return { success: false, data: [] };
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

export const checkServerStatus = async () => {
    try {
        // Strip /api as our test route is the root '/'
        const rootUrl = API_URL.replace('/api', '');
        const res = await axios.get(`${rootUrl}/`, { timeout: 5000 });
        return { success: true, message: res.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};
