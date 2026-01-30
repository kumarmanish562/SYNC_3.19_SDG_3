import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="lungs" size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.headerText}>CoughX</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.illustrationContainer}>
                    <View style={styles.circleBackground}>
                        <View style={styles.iconGroup}>
                            <MaterialCommunityIcons name="qrcode-scan" size={80} color={colors.primary} />
                        </View>
                    </View>
                </View>

                <View style={styles.textContent}>
                    <Text style={styles.title}>Welcome to CoughX</Text>
                    <Text style={styles.subtitle}>
                        AI-powered tuberculosis screening right from your phone.
                    </Text>

                    <View style={styles.paginationContainer}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('HowItWorks')}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.skipText}>Skip</Text>
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
        justifyContent: 'space-between',
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Distribute space
        marginTop: 20,
        marginBottom: 10,
    },
    logoContainer: {
        width: 40,
        alignItems: 'flex-start',
    },
    headerText: {
        fontSize: 18, // Reduced slightly to look more standard
        fontWeight: '700',
        color: '#000',
        letterSpacing: 0.5,
    },
    illustrationContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    circleBackground: {
        width: width * 0.75, // Slightly larger
        height: width * 0.75,
        borderRadius: (width * 0.75) / 2,
        backgroundColor: colors.lightBlue,
        justifyContent: 'center',
        alignItems: 'center',
        // Removed overflow hidden to let badges pop if needed, but keeping simple for now
    },
    iconGroup: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContent: {
        flex: 1, // Occupy remaining space
        alignItems: 'center',
        paddingHorizontal: 10, // Tighter padding for text
        justifyContent: 'flex-start', // Push to top of this section
    },
    title: {
        fontSize: 26, // Larger title
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondaryText,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30, // More space before pagination
        paddingHorizontal: 20,
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
        width: '100%',
        alignItems: 'center',
        paddingBottom: 10,
    },
    button: {
        backgroundColor: colors.primary,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
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
    skipButton: {
        paddingVertical: 8,
    },
    skipText: {
        color: colors.secondaryText,
        fontSize: 15,
        fontWeight: '500',
    },
});

export default WelcomeScreen;
