import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const MicrophoneAccessScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>TB-SCAN</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>

                <View style={styles.visualContainer}>
                    <View style={styles.circleOuter}>
                        <View style={styles.circleMiddle}>
                            <View style={styles.circleInner}>
                                <Ionicons name="mic" size={48} color={colors.primary} />
                            </View>
                        </View>
                    </View>
                </View>

                <Text style={styles.title}>Microphone Access</Text>
                <Text style={styles.description}>
                    To accurately assess your health, TB-SCAN needs to record and analyze your cough audio. Use simple background noise reduction environment if possible.
                </Text>

                <View style={styles.noteContainer}>
                    <Ionicons name="information-circle" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.noteText}>ANC (Active Noise Cancellation) recommended</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.enableButton}
                        onPress={() => navigation.replace('RecordCough')}
                    >
                        <Text style={styles.enableButtonText}>Enable Microphone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.notNowButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.notNowButtonText}>Not Now</Text>
                    </TouchableOpacity>
                </View>

            </View>
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
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    visualContainer: {
        marginBottom: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleOuter: {
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: '#F0FAFF', // Very light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleMiddle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#E1F5FE', // Slightly darker light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleInner: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#B3E5FC', // More distinct blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 30,
    },
    noteText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
    enableButton: {
        backgroundColor: colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    enableButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    notNowButton: {
        backgroundColor: '#F5F5F5',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    notNowButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MicrophoneAccessScreen;
