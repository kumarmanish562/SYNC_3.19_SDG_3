import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const RecordCoughScreen = ({ navigation }) => {
    // Placeholder state for recording visualization
    const [recordingTime, setRecordingTime] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>TB-SCAN</Text>
                <View style={{ width: 28 }} /> {/* Spacer */}
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Record Your Cough</Text>
                {/* Title Underline */}
                <View style={styles.titleUnderline} />

                {/* Central Record Button with Rings */}
                <View style={styles.recordContainer}>
                    {/* Outer Ring 2 */}
                    <View style={styles.ringOuter}>
                        {/* Outer Ring 1 */}
                        <View style={styles.ringInner}>
                            <TouchableOpacity
                                style={styles.recordButton}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Analyzing')}
                            >
                                <MaterialCommunityIcons name="microphone" size={48} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.mainInstruction}>Press and hold to start</Text>
                    <Text style={styles.subInstruction}>Hold for 5 seconds for best results</Text>
                </View>

                {/* Waveform Visualization (Static Placeholder) */}
                <View style={styles.waveformContainer}>
                    {[...Array(15)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.waveBar,
                                {
                                    height: [20, 35, 25, 50, 30, 60, 40, 70, 40, 50, 30, 45, 25, 30, 20][i],
                                    backgroundColor: colors.primary // Or toggle color based on activity
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Footer Status */}
                <View style={styles.footerContainer}>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>RECORDING STATUS</Text>
                        <Text style={styles.timeLabel}>0s / 5s</Text>
                    </View>
                    {/* Progress Bar */}
                    <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: '0%' }]} />
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
        paddingTop: 10,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 1,
    },
    backButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        justifyContent: 'space-between', // Distribute vertically
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
        backgroundColor: '#E1F5FE', // Very light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringInner: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#B3E5FC', // Slightly darker light blue
        justifyContent: 'center',
        alignItems: 'center',
    },
    recordButton: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: colors.primary, // Main Blue
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
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
    waveformContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        marginBottom: 20,
        marginTop: 40, // Push down
    },
    waveBar: {
        width: 6,
        borderRadius: 3,
        marginHorizontal: 3,
        backgroundColor: colors.lightBlue,
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
        letterSpacing: 0.5,
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
