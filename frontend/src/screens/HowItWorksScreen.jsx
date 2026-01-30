import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const HowItWorksScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Top Illustration Placeholder */}
                <View style={styles.imageContainer}>
                    {/* Placeholder for the vector art in the design */}
                    <View style={styles.imagePlaceholder}>
                        <MaterialCommunityIcons name="face-woman-shimmer" size={100} color="#555" />
                    </View>
                </View>

                {/* Title Section */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>How it Works</Text>
                    <Text style={styles.subtitle}>
                        Follow these three simple steps to get your screening result.
                    </Text>
                </View>

                {/* Steps Section */}
                <View style={styles.stepsContainer}>
                    {/* Connecting Line - Absolute positioned behind the icons */}
                    <View style={styles.connectingLine} />

                    {/* Step 1 */}
                    <View style={styles.stepRow}>
                        <View style={[styles.iconContainer, styles.iconBgLight]}>
                            <MaterialCommunityIcons name="volume-off" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Find a quiet place</Text>
                            <Text style={styles.stepSubtitle}>STEP 1</Text>
                        </View>
                    </View>

                    {/* Step 2 */}
                    <View style={styles.stepRow}>
                        <View style={[styles.iconContainer, styles.iconBgPrimary]}>
                            <MaterialCommunityIcons name="microphone" size={24} color="#FFF" />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Record your cough for 5 seconds</Text>
                            <Text style={styles.stepSubtitle}>STEP 2</Text>
                        </View>
                    </View>

                    {/* Step 3 */}
                    <View style={styles.stepRow}>
                        <View style={[styles.iconContainer, styles.iconBgLight]}>
                            <MaterialCommunityIcons name="auto-fix" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.stepTextContainer}>
                            <Text style={styles.stepTitle}>Get AI-powered results instantly</Text>
                            <Text style={styles.stepSubtitle}>STEP 3</Text>
                        </View>
                    </View>
                </View>

                {/* Pagination Dots */}
                <View style={styles.paginationContainer}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Privacy')} // Next step
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    imagePlaceholder: {
        width: '100%',
        height: 220,
        backgroundColor: '#F5E6D3', // Beige-ish background like the design
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: colors.secondaryText,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    stepsContainer: {
        marginBottom: 30,
        position: 'relative',
        paddingLeft: 10,
    },
    connectingLine: {
        position: 'absolute',
        left: 34, // (Icon container width / 2) + paddingLeft
        top: 24, // Start slightly below the top of first icon
        bottom: 50, // End slightly above the last icon
        width: 2,
        backgroundColor: '#E0E0E0',
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24, // Spacing between steps
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        zIndex: 1, // On top of the line
    },
    iconBgLight: {
        backgroundColor: colors.lightBlue,
    },
    iconBgPrimary: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    stepTextContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    stepSubtitle: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: colors.primary,
        width: 24,
    },
    actionContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        paddingVertical: 8,
    },
    backText: {
        color: colors.secondaryText,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default HowItWorksScreen;
