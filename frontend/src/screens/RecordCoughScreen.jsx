import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

import * as DocumentPicker from 'expo-document-picker';

const RecordCoughScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);

    // ... existing logic ...

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

    // Cleanup recording when leaving screen
    useEffect(() => {
        return () => {
            if (recording) {
                recording.stopAndUnloadAsync();
            }
        };
    }, [recording]);

    const cleanupRecording = async () => {
        if (recording) {
            try {
                await recording.stopAndUnloadAsync();
            } catch (error) {
                console.log("Error cleaning up recording:", error);
            }
            setRecording(null);
            setIsRecording(false);
        }
    };

    const startRecording = async () => {
        try {
            // Ensure no previous recording exists
            if (recording) {
                await cleanupRecording();
            }

            const permission = await Audio.requestPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert("Permission Denied", "Microphone access is required.");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const RECORDING_OPTIONS = {
                android: Audio.RecordingOptionsPresets.HIGH_QUALITY,
                ios: {
                    extension: '.wav',
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            };

            const { recording: newRecording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);

            setRecording(newRecording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
            // If we hit the specific "Only one Recording" error, try to cleanup and maybe user has to tap again
            if (err.message && err.message.includes('Only one Recording')) {
                await cleanupRecording();
                Alert.alert("Error", "Previous recording session was not closed. Please try again.");
            }
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Clean local state but keep URI for navigation
            setRecording(null);

            console.log('Recording stored at', uri);
            // Navigate to Analyzing Screen with URI
            navigation.navigate('Analyzing', { audioUri: uri });

        } catch (error) {
            console.error("Failed to stop recording", error);
        }
    };

    const pickAudio = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'audio/*',
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                navigation.navigate('Analyzing', {
                    audioUri: file.uri,
                    fileMetadata: { name: file.name, type: file.mimeType }
                });
            }
        } catch (err) {
            console.error("Error picking file", err);
            Alert.alert("Error", "Failed to select audio file.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SwaaS</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>{isRecording ? t('record_title_recording') : t('record_title_start')}</Text>
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
                        {isRecording ? t('record_instruction_recording') : t('record_instruction_start')}
                    </Text>
                    <Text style={styles.subInstruction}>
                        {isRecording ? t('record_sub_recording') : t('record_sub_start')}
                    </Text>

                    {!isRecording && (
                        <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
                            <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                            <Text style={styles.uploadButtonText}>{t('upload_audio')}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Footer Status */}
                <View style={styles.footerContainer}>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>{t('status_label')}</Text>
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
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: '#F0FAFF'
    },
    uploadButtonText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
        marginLeft: 8
    }
});

export default RecordCoughScreen;
