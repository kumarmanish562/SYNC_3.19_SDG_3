import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleReset = () => {
        // API call to backend /api/auth/forgot-password
        console.log("sending reset link to", email);
        // Show confirmation or go back
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoBox}>
                        <MaterialCommunityIcons name="medical-bag" size={40} color={colors.primary} />
                    </View>
                    <Text style={styles.appTitle}>TB-SCAN</Text>
                    <Text style={styles.appSubtitle}>ASSESSMENT TOOL</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>

                    <Text style={styles.screenTitle}>Reset Password</Text>
                    <Text style={styles.description}>
                        Enter your email to receive a password reset link.
                    </Text>

                    <View style={styles.formContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <MaterialCommunityIcons name="email-outline" size={20} color="#999" />
                        </View>

                        <TouchableOpacity style={styles.mainButton} onPress={handleReset}>
                            <Text style={styles.mainButtonText}>Send Reset Link</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.backButtonText}>Back to Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardFooter}>
                        <MaterialCommunityIcons name="lungs" size={40} color="#E0E0E0" />
                    </View>
                </View>

                <Text style={styles.copyrightText}>© 2024 TB-SCAN HEALTH SYSTEMS</Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        letterSpacing: 2,
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
        borderColor: colors.primary + '20',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        paddingHorizontal: 10,
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
        marginBottom: 24,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        marginRight: 10,
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    cardFooter: {
        marginTop: 40,
    },
    copyrightText: {
        fontSize: 10,
        color: '#999',
        letterSpacing: 1,
    },
});

export default ForgotPasswordScreen;
