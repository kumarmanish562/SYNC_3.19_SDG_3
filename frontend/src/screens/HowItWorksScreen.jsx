import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const HowItWorksScreen = ({ navigation }) => {
    const { t } = useTranslation();

    const steps = [
        {
            id: 1,
            icon: 'location-outline', // Ionicons
            titleKey: 'step_1_title',
            subKey: 'step_1_sub',
            bgColor: '#F0F4F8',
            iconColor: '#546E7A'
        },
        {
            id: 2,
            icon: 'lungs', // MaterialCommunityIcons
            titleKey: 'step_2_title', // Changed icon in image is stylized lungs/sound
            subKey: 'step_2_sub',
            bgColor: '#E1F5FE', // Light blue bg from image ref
            iconColor: '#546E7A'
        },
        {
            id: 3,
            icon: 'mic-outline', // Ionicons
            titleKey: 'step_3_title',
            subKey: 'step_3_sub',
            bgColor: '#B3E5FC', // Stronger blue
            iconColor: '#0288D1', // Active blue
            isHighlighted: true
        }
    ];

    return (
        <View style={styles.container}>
            {/* Top Gradient Background */}
            <LinearGradient
                colors={['#0F2027', '#203A43', '#2C5364']} // Dark teal/blue gradient like reference
                style={styles.topBackground}
            >
                <SafeAreaView style={styles.headerSafeArea}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{t('how_it_works')}</Text>

                        {/* Glassmorphism Mic Icon Box */}
                        <View style={styles.glassIconBox}>
                            <MaterialCommunityIcons name="microphone-outline" size={32} color="#00E5FF" />
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Floating Card */}
            <View style={styles.cardContainer}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{t('how_it_works')}</Text>
                        <Text style={styles.cardSubtitle}>
                            {t('how_it_works_subtitle')}
                        </Text>
                    </View>

                    {/* Steps Timeline */}
                    <View style={styles.stepsContainer}>
                        {/* Connecting Line */}
                        <View style={styles.timelineLine} />

                        {steps.map((step, index) => (
                            <View key={step.id} style={styles.stepRow}>
                                {/* Icon Circle */}
                                <View style={[
                                    styles.iconCircle,
                                    step.isHighlighted && styles.activeIconCircle,
                                    { backgroundColor: step.id === 3 ? '#FFFFFF' : '#E0E0E0' } // Simplification
                                ]}>
                                    {step.id === 3 && <View style={styles.activeRing} />}
                                    {step.id === 2 ? (
                                        <MaterialCommunityIcons name="waveform" size={24} color={step.isHighlighted ? '#0288D1' : '#555'} />
                                    ) : (
                                        <Ionicons
                                            name={step.icon}
                                            size={24}
                                            color={step.isHighlighted ? '#0288D1' : '#555'}
                                        />
                                    )}
                                </View>

                                {/* Text Info */}
                                <View style={styles.stepInfo}>
                                    <Text style={styles.stepTitle}>{t(step.titleKey)}</Text>
                                    <Text style={styles.stepSub}>{t(step.subKey)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        <View style={styles.dot} />
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={styles.continueButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Privacy')}
                    >
                        <LinearGradient
                            colors={[colors.primary, '#4FC3F7']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>{t('continue')}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{t('back')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    topBackground: {
        height: '45%', // Takes up top portion
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
    },
    headerSafeArea: {
        flex: 1,
        // justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        width: '60%',
    },
    glassIconBox: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cardContainer: {
        flex: 1,
        marginTop: -100, // Pull up to overlap
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 20,
        minHeight: 480,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardSubtitle: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    stepsContainer: {
        marginBottom: 30,
        position: 'relative',
    },
    timelineLine: {
        position: 'absolute',
        left: 24, // Center of circle (approx)
        top: 20,
        bottom: 20,
        width: 2,
        backgroundColor: '#E0E0E0',
        zIndex: 0,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        zIndex: 1,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 2,
        borderColor: '#FFF', // White border to cut line
        zIndex: 2,
    },
    activeIconCircle: {
        backgroundColor: '#FFFFFF',
        borderColor: '#0288D1', // active blue border
        borderWidth: 2,
    },
    activeRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E1F5FE',
        zIndex: -1,
    },
    stepInfo: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    stepSub: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        backgroundColor: '#0288D1',
        width: 20,
    },
    continueButton: {
        width: '100%',
        shadowColor: '#0288D1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    backButton: {
        marginTop: 10,
        padding: 10,
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

export default HowItWorksScreen;
