import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { auth, db } from '../services/firebaseConfig';
import { ref, update } from 'firebase/database';
import { useTranslation } from 'react-i18next';

const WhatsAppConnectScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [linked, setLinked] = useState(false);

    // Replace this with your actual Ngrok/Server URL if you want dynamic linking, 
    // or just direct user to the WhatsApp bot number
    const WHATSAPP_BOT_NUMBER = "916265667534"; // Correct number from screenshot
    // Use deep link to force open app
    const WA_LINK = `whatsapp://send?phone=+${WHATSAPP_BOT_NUMBER}&text=Link my account`;

    const handleConnect = async () => {
        // In a real scenario, we might ask user to input their phone number first
        // and save it to Firebase so the webhook can match it.
        // For this demo, we'll assume the user just clicks to chat.

        // 1. Save "Intent" to link (Optional)
        setLoading(true);
        if (auth.currentUser) {
            try {
                // Here we would ideally prompt for the phone number they use on WhatsApp
                // For now, let's just open the link
                await Linking.openURL(WA_LINK);
                setLinked(true);
            } catch (err) {
                console.error("Failed to open WhatsApp", err);
            }
        }
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Connect WhatsApp</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <FontAwesome5 name="whatsapp" size={60} color="#FFF" />
                </View>

                <Text style={styles.title}>Analyze via WhatsApp</Text>
                <Text style={styles.description}>
                    Connect your Swass account to our WhatsApp bot.
                    You can then simply forward voice notes or record audio in WhatsApp
                    to get an instant PDF health report.
                </Text>

                <View style={styles.stepContainer}>
                    <StepRow num="1" text="Click the button below to open WhatsApp." />
                    <StepRow num="2" text="Send the pre-filled 'Link' message." />
                    <StepRow num="3" text="Record a cough and send it to the bot!" />
                </View>

                <TouchableOpacity
                    style={styles.connectBtn}
                    onPress={handleConnect}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            <FontAwesome5 name="whatsapp" size={20} color="#FFF" style={{ marginRight: 10 }} />
                            <Text style={styles.btnText}>Open WhatsApp Bot</Text>
                        </>
                    )}
                </TouchableOpacity>

                {linked && (
                    <Text style={styles.successText}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.primary} /> Link Opened! Check your WhatsApp.
                    </Text>
                )}
            </View>
        </SafeAreaView>
    );
};

const StepRow = ({ num, text }) => (
    <View style={styles.stepRow}>
        <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{num}</Text>
        </View>
        <Text style={styles.stepText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        elevation: 10,
        shadowColor: '#25D366',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    stepContainer: {
        width: '100%',
        marginBottom: 40,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
        padding: 15,
        borderRadius: 12,
    },
    stepNum: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    stepText: {
        fontSize: 14,
        color: '#444',
        flex: 1,
    },
    connectBtn: {
        backgroundColor: '#25D366',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    btnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    successText: {
        marginTop: 20,
        color: colors.primary,
        fontWeight: 'bold',
    }
});

export default WhatsAppConnectScreen;
