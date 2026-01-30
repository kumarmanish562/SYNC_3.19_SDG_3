import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
    const [isRecording, setIsRecording] = useState(false);

    const handleStartTest = () => {
        setIsRecording(!isRecording);
        navigation.navigate('MicrophoneAccess');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name="lungs" size={24} color={colors.primary} />
                </View>
                <Text style={styles.headerTitle}>CoughX</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.statusContainer}>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Ready to scan</Text>
                    </View>
                </View>

                <Text style={styles.mainTitle}>Instant Lung Health Assessment</Text>
                <Text style={styles.subtitle}>Simple, non-invasive tuberculosis screening using AI cough analysis.</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.mainActionButton}
                        onPress={handleStartTest}
                        activeOpacity={0.9}
                    >
                        <View style={styles.micIconContainer}>
                            <MaterialCommunityIcons name="microphone" size={32} color={colors.white} />
                        </View>
                        <Text style={styles.btnTitle}>Start Cough Test</Text>
                        <Text style={styles.btnSubtitle}>Press to record</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Why use TB-SCAN?</Text>
                    <Text style={styles.sectionSubtitle}>Our advanced AI provides clinical-grade insights.</Text>

                    <View style={styles.featureCard}>
                        <View style={styles.featureIconBox}>
                            <Ionicons name="flash" size={28} color={colors.primary} />
                        </View>
                    </View>
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
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 1,
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    statusContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F7FA',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00C853',
        marginRight: 8,
    },
    statusText: {
        color: '#00695C',
        fontWeight: '600',
        fontSize: 14,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
        color: '#000',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.secondaryText,
        paddingHorizontal: 40,
        marginBottom: 40,
        lineHeight: 22,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 10,
    },
    mainActionButton: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    micIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    btnTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 4,
    },
    btnSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    infoSection: {
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: colors.secondaryText,
        marginBottom: 20,
    },
    featureCard: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        padding: 40,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
        height: 150,
    },
    featureIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
