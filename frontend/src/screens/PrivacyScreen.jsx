import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next'; // Import translation hook

const { width } = Dimensions.get('window');

const PrivacyScreen = ({ navigation }) => {
    const { t } = useTranslation(); // Use hook

    const securityFeatures = [
        "privacy_feat_1",
        "privacy_feat_2",
        "privacy_feat_3"
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                {/* Illustration Section */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.circleBackground}>
                        <MaterialCommunityIcons name="shield-check-outline" size={70} color={colors.primary} />

                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>{t('privacy_title')}</Text>
                    <Text style={styles.subtitle}>
                        {t('privacy_subtitle')}
                    </Text>
                </View>

                {/* Features List */}
                <View style={styles.featuresContainer}>
                    {securityFeatures.map((featureKey, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={styles.checkIcon}>
                                <Ionicons name="checkmark" size={16} color={colors.primary} />
                            </View>
                            <Text style={styles.featureText}>{t(featureKey)}</Text>
                        </View>
                    ))}
                </View>

                {/* Bottom Section: Pagination & Action */}
                <View style={styles.bottomSection}>
                    {/* Features List placed above? No, design shows features then space then button. */}

                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={[styles.dot, styles.activeDot]} />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Text style={styles.buttonText}>{t('lets_start')}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
        flex: 1,
    },
    circleBackground: {
        width: width * 0.5,
        height: width * 0.5,
        borderRadius: (width * 0.5) / 2,
        backgroundColor: '#E1F5FE', // Light blue circle
        justifyContent: 'center',
        alignItems: 'center',
        // Start glow effect
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    featuresContainer: {
        marginBottom: 40,
        width: '100%',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 12,
        // Shadow for cards
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    checkIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
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
        width: 8,
        height: 8,
    },
    button: {
        backgroundColor: '#0288D1', // Primary Blue
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0288D1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default PrivacyScreen;
