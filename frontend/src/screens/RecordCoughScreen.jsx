import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const RecordCoughScreen = ({ navigation }) => {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration(prev => prev + 100); // ms
            }, 100);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert("Permission Denied", "Microphone access is required.");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        console.log('Recording stored at', uri);

        // Navigate to Analyzing Screen with URI
        navigation.navigate('Analyzing', { audioUri: uri });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>TB-SCAN</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{isRecording ? "Recording..." : "Record Your Cough"}</Text>
                <View style={styles.titleUnderline} />

                {/* Record Button */}
                <View style={styles.recordContainer}>
                    <View style={[styles.ringOuter, isRecording && styles.recordingPulseOuter]}>
                        <View style={[styles.ringInner, isRecording && styles.recordingPulseInner]}>
                            <TouchableOpacity
                                style={[styles.recordButton, isRecording && styles.recordingButtonActive]}
                                activeOpacity={0.8}
                                onPress={isRecording ? stopRecording : startRecording}
                            >
                                <MaterialCommunityIcons
                                    name={isRecording ? "stop" : "microphone"}
                                    size={48}
                                    color={colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.mainInstruction}>
                        {isRecording ? "Cough naturally near the mic" : "Tap to start recording"}
                    </Text>
                    <Text style={styles.subInstruction}>
                        {isRecording ? "Tap again to stop" : "Hold for 5 seconds for best results"}
                    </Text>
                </View>

                {/* Footer Status */}
                <View style={styles.footerContainer}>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>RECORDING STATUS</Text>
                        <Text style={styles.timeLabel}>{(duration / 1000).toFixed(1)}s / 5s</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${Math.min((duration / 5000) * 100, 100)}%` }
                            ]}
                        />
                    </View>
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
        color: colors.primary,
    },
    backButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    titleUnderline: {
        width: 40,
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
        marginBottom: 60,
    },
    recordContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringOuter: {
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#B3E5FC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordingPulseOuter: {
        backgroundColor: '#FFEBEE', // Red tint when recording
    },
    recordingPulseInner: {
        backgroundColor: '#FFCDD2',
    },
    recordButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    recordingButtonActive: {
        backgroundColor: '#FF5252', // Red stop button
        shadowColor: '#FF5252',
    },
    instructionsContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    mainInstruction: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    subInstruction: {
        fontSize: 14,
        color: colors.secondaryText,
    },
    footerContainer: {
        width: '100%',
        paddingHorizontal: 24,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statusLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#9E9E9E',
    },
    timeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
    },
    progressBarTrack: {
        width: '100%',
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
});

export default RecordCoughScreen;
