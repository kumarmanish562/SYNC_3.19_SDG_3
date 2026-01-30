import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const MedicalDisclaimerScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Medical Disclaimer</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Icon Header */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <MaterialCommunityIcons name="clipboard-account-outline" size={40} color={colors.primary} />
                    </View>
                </View>

                {/* Main Content Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Important Information</Text>
                    <Text style={styles.paragraph}>
                        TB-SCAN is a screening tool designed to provide a preliminary assessment of tuberculosis risk based on cough audio analysis.
                    </Text>

                    {/* Warning Box */}
                    <View style={styles.warningBox}>
                        <Text style={styles.warningTitle}>WARNING</Text>
                        <Text style={styles.warningText}>
                            This application is <Text style={{ fontWeight: 'bold' }}>not a substitute</Text> for professional medical diagnosis, clinical advice, or treatment.
                        </Text>
                    </View>

                    <Text style={styles.paragraph}>
                        If you are experiencing severe symptoms, please consult a qualified healthcare professional or visit a clinic immediately. Never disregard professional medical advice because of something you have read or interpreted through this app.
                    </Text>

                    {/* Checkbox Agreement Text */}
                    <View style={styles.agreementRow}>
                        <MaterialCommunityIcons name="shield-check" size={20} color={colors.primary} style={{ marginTop: 2 }} />
                        <Text style={styles.agreementText}>
                            By proceeding, you acknowledge that you have read and understood the nature of this screening tool.
                        </Text>
                    </View>

                    {/* I Understand Button */}
                    <TouchableOpacity
                        style={styles.understandButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>I Understand</Text>
                        <Ionicons name="checkmark-circle" size={20} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>

                    <Text style={styles.footerText}>TB-SCAN HEALTH SYSTEMS</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

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
        paddingVertical: 14,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        // Using shadow from image style (soft, elevated)
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        marginBottom: 20,
    },
    warningBox: {
        backgroundColor: '#FFF8E1', // Light yellow
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FFD54F',
    },
    warningTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#A1887F', // Brownish
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    warningText: {
        fontSize: 13,
        color: '#5D4037',
        lineHeight: 18,
    },
    agreementRow: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingRight: 10,
    },
    agreementText: {
        fontSize: 11,
        color: '#999',
        marginLeft: 10,
        lineHeight: 16,
        flex: 1,
    },
    understandButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 10,
        color: '#CCC',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default MedicalDisclaimerScreen;
