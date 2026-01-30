import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { auth, db } from '../services/firebaseConfig';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { sendOtp, verifyOtp } from '../services/api';

const { width } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Sign Up specific state
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // OTP specific state
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');

    // Auth Function
    const handleAuth = async () => {
        // 1. Basic Validation
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        if (isLogin && !password) {
            Alert.alert("Error", "Please enter your password");
            return;
        }

        if (!isLogin) {
            // Sign Up Validation
            if (!name || !mobile || !confirmPassword || !password) {
                Alert.alert("Error", "Please fill in all fields");
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match");
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                // LOGIN FLOW: Direct Firebase Login (No OTP)
                await signInWithEmailAndPassword(auth, email, password);
                // navigation.replace("MainTabs");
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            } else {
                // SIGNUP FLOW: Send OTP first
                console.log("Sending OTP to:", email);
                await sendOtp(email);

                // Navigate to OTP Screen
                navigation.navigate("OtpVerification", {
                    email,
                    password,
                    mobile,
                    name,
                    isLogin: false // Always signup if we go here
                });
            }

        } catch (error) {
            console.error("Auth Error:", error);
            // Handle Firebase specific errors
            let errorMessage = "Could not complete request.";
            if (error.code === 'auth/invalid-credential') {
                errorMessage = "Invalid email or password.";
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = "User not found.";
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = "Incorrect password.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            Alert.alert("Authentication Failed", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Google Sign-In requires native setup (SHA-1, Client IDs) which is complex for a quick demo.
        // For the hackathon, we encourage using the Email/Password Sign Up since it is fully connected to Firebase.
        console.log("Google Login Pressed");
        Alert.alert(
            "Demo Mode",
            "Google Sign-In requires additional Native configuration. Please use the Email/Sign Up form to test the Firebase integration.",
            [{ text: "OK" }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <Image
                        source={require('../../assets/swaas_logo.png')}
                        style={{ width: 220, height: 150, resizeMode: 'contain' }}
                    />
                    {/* <Text style={styles.appTitle}>TB-SCAN</Text> */}
                    {/* <Text style={styles.appSubtitle}>Smart Tuberculosis Screening</Text> */}
                </View>

                {/* Card Container */}
                <View style={styles.card}>

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>{t('login')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, !isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>{t('signup')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Inputs */}
                    <View style={styles.formContainer}>

                        {!isLogin && (
                            <>
                                <Text style={styles.label}>{t('full_name')}</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="John Doe"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                    <Ionicons name="person-outline" size={20} color="#999" />
                                </View>
                            </>
                        )}

                        <Text style={styles.label}>{t('email_address')}</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('placeholder_email')}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <MaterialCommunityIcons name="email-outline" size={20} color="#999" />
                        </View>

                        {!isLogin && (
                            <>
                                <Text style={styles.label}>{t('mobile_number')}</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+1 234 567 8900"
                                        value={mobile}
                                        onChangeText={setMobile}
                                        keyboardType="phone-pad"
                                    />
                                    <Ionicons name="call-outline" size={20} color="#999" />
                                </View>
                            </>
                        )}

                        <Text style={styles.label}>{t('password')}</Text>
                        {!otpSent && (
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="........"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                // placeholderTextColor="#999"
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                                </TouchableOpacity>
                            </View>
                        )}

                        {otpSent && (
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('otp_enter')}
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                />
                                <Ionicons name="key-outline" size={20} color={colors.primary} />
                            </View>
                        )}

                        {!isLogin && (
                            <>
                                <Text style={styles.label}>{t('confirm_password')}</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="........"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}

                        {isLogin && (
                            <TouchableOpacity
                                style={styles.forgotPassContainer}
                                onPress={() => navigation.navigate('ForgotPassword')}
                            >
                                <Text style={styles.forgotPassText}>{t('forgot_password')}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity style={[styles.mainButton, loading && { backgroundColor: '#AAA' }]} onPress={handleAuth} disabled={loading}>
                            <Text style={styles.mainButtonText}>
                                {loading ? t('auth_pending') : (isLogin ? t('login') : t('signup'))}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider & Google Button - Only for Login */}
                        {isLogin && (
                            <>
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>{t('or')}</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                                    {/* In real app use actual Google logo image */}
                                    <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
                                    <Text style={styles.googleButtonText}>{t('continue_with_google')}</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {/* Footer Icon */}
                    <View style={styles.cardFooter}>
                        <MaterialCommunityIcons name="lungs" size={40} color="#E0E0E0" />
                    </View>
                </View>

                <Text style={styles.copyrightText}>{t('copyright')}</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary, // Blue background as per border in image? Or maybe white with blue accent.
        // Image shows white card on potentially grey/blue bg. Let's use a soft background.
        backgroundColor: '#F0F4F8',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoBox: {
        width: 70,
        height: 70,
        backgroundColor: '#E1F5FE',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    appSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: colors.primary + '20', // Subtle blue border
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
    },
    activeTabText: {
        color: '#333',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        marginRight: 10,
    },
    forgotPassContainer: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPassText: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    mainButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    mainButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#999',
        fontSize: 12,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 16,
    },
    googleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    cardFooter: {
        alignItems: 'center',
        marginTop: 30,
    },
    copyrightText: {
        fontSize: 10,
        color: '#999',
        letterSpacing: 1,
    },
});

export default AuthScreen;
