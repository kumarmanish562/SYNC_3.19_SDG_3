import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const PrivacyScreen = ({ navigation }) => {
    const securityFeatures = [
        "End-to-end Encryption",
        "GDPR Compliant",
        "Anonymous Analysis"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.circleBackground}>
                        <MaterialCommunityIcons name="shield-check-outline" size={70} color={colors.primary} />
                        <View style={styles.heartBadge}>
                            <Ionicons name="heart" size={18} color={colors.primary} />
                        </View>
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>Private & Secure</Text>
                    <Text style={styles.subtitle}>
                        Your health data is your own. All cough recordings are fully encrypted, and your personal information is never shared without your explicit consent.
                    </Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    {securityFeatures.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={16} color={colors.primary} />
                            </View>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                {/* Bottom Section: Pagination & Action */}
                <View style={styles.bottomSection}>
                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={[styles.dot, styles.activeDot]} />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Auth')} // Final step, go to auth
                    >
                        <Text style={styles.buttonText}>Let's Start</Text>
                        <Ionicons name="arrow-forward" size={20} color={colors.white} style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 30,
        justifyContent: 'space-between',
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    circleBackground: {
        width: width * 0.6,
        height: width * 0.6,
        borderRadius: (width * 0.6) / 2,
        backgroundColor: colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    heartBadge: {
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        backgroundColor: colors.primary, // Using primary blue for contrast, or maybe a lighter blue? Image shows white heart on blue circle? OR blue heart on white circle. Let's try white heart on primary blue to match design feeling.
        // Actually looking at the image: it's a white circle with a blue heart inside? No, it looks like a small white bubble with a blue heart inside.
        // Let's approximate: White container, blue heart.
        backgroundColor: '#FFF',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: colors.secondaryText,
        textAlign: 'center',
        lineHeight: 22,
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA', // Very light grey/white background
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#D6F1F9', // Very light blue
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    featureText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    bottomSection: {
        alignItems: 'center',
        width: '100%',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
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
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});

export default PrivacyScreen;
