import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { verifyOtp } from '../services/api';
import { auth, db } from '../services/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const OtpVerificationScreen = ({ route, navigation }) => {
    // Get params passed from AuthScreen
    const { email, password, name, mobile, isLogin } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto focus next input
        if (text && index < 5) {
            // Basic implementation: In real app use refs to focus
        }
    };

    const getOtpString = () => otp.join('');

    const handleVerify = async () => {
        const otpCode = getOtpString();
        if (otpCode.length !== 6) {
            Alert.alert("Error", "Please enter valid 6-digit code");
            return;
        }

        setLoading(true);
        try {
            // 1. Verify OTP with Backend
            const res = await verifyOtp(email, otpCode);

            if (res.success) {
                // 2. Perform Final Auth Action (Login or Signup)
                if (isLogin) {
                    // Login
                    await signInWithEmailAndPassword(auth, email, password);
                    // navigation.replace("MainTabs");
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });
                } else {
                    // Signup
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Update Profile
                    await updateProfile(user, { displayName: name });

                    // Save Data
                    await set(ref(db, 'users/' + user.uid), {
                        username: name,
                        email: email,
                        mobile: mobile,
                        gender: "Not set",
                        dob: "Not set",
                        createdAt: new Date().toISOString()
                    });

                    Alert.alert("Success", "Account Verified & Created!", [
                        {
                            text: "Go Home",
                            onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'MainTabs' }],
                            })
                        }
                    ]);
                }
            } else {
                Alert.alert("Error", "Invalid Code");
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Verification Failed", error.message || "Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="shield-checkmark" size={60} color={colors.primary} />
                </View>

                <Text style={styles.title}>Verification</Text>
                <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
                <Text style={styles.emailText}>{email}</Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            maxLength={1}
                            keyboardType="number-pad"
                            onChangeText={(text) => handleChange(text, index)}
                            value={digit}
                            autoFocus={index === 0}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.verifyButton, loading && { backgroundColor: '#AAA' }]}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    <Text style={styles.verifyButtonText}>{loading ? "Verifying..." : "Verify & Continue"}</Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code? </Text>
                    <TouchableOpacity disabled={timer > 0}>
                        <Text style={[styles.resendLink, timer > 0 && { color: '#999' }]}>
                            {timer > 0 ? `Resend in ${timer}s` : "Resend"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    backButton: {
        margin: 20,
    },
    content: {
        padding: 24,
        alignItems: 'center',
        marginTop: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
        marginBottom: 32,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderBottomWidth: 2,
        borderBottomColor: '#DDD',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    verifyButton: {
        width: '100%',
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    verifyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
    },
    resendText: {
        color: '#666',
        fontSize: 14,
    },
    resendLink: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default OtpVerificationScreen;
