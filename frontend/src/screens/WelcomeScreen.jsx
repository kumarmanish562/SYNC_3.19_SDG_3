import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <LinearGradient
            colors={['#E1F5FE', '#F0F4F8', '#FFFFFF']}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="dark-content" />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerText}>SwaaS</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.langButton}
                        onPress={() => navigation.navigate('LanguageSelection')}
                    >
                        <Ionicons name="globe-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={styles.contentContainer}>
                    {/* Hero Illustration */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/welcome_hero.png')}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Text Content */}
                    <View style={styles.textSection}>
                        <Text style={styles.title}>{t('welcome_title')}</Text>
                        <Text style={styles.subtitle}>
                            {t('welcome_subtitle')}
                        </Text>

                        {/* Pagination Dots */}
                        <View style={styles.paginationContainer}>
                            <View style={[styles.dot, styles.activeDot]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('HowItWorks')}
                        >
                            <LinearGradient
                                colors={[colors.primary, '#4FC3F7']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.buttonText}>{t('get_started')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.skipButton}
                            onPress={() => navigation.navigate('Auth')}
                        >
                            <Text style={styles.skipText}>{t('skip')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 10,
        marginBottom: 10,
    },
    langButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0277BD', // Darker blue to match brand
        letterSpacing: 0.5,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    imageContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        // Add some bounce or floating effect if possible, but keep simple for now
    },
    heroImage: {
        width: width * 0.9,
        height: width * 0.9,
        maxHeight: 400,
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0D47A1', // Deep blue
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#546E7A', // Blue grey
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CFD8DC',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#0288D1', // Active blue
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        borderRadius: 16,
        shadowColor: '#0288D1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 20,
    },
    gradientButton: {
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    skipButton: {
        paddingVertical: 10,
    },
    skipText: {
        color: '#78909C',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default WelcomeScreen;
