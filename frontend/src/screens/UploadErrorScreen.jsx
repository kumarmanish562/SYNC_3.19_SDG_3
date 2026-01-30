import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const UploadErrorScreen = ({ navigation }) => {
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

                {/* Error Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.rippleOuter}>
                        <View style={styles.rippleInner}>
                            <View style={styles.errorIconCircle}>
                                <Ionicons name="warning" size={40} color="#FF5252" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Error Text */}
                <Text style={styles.title}>Something went wrong</Text>
                <Text style={styles.description}>
                    The audio recording for your screening failed to upload. Please check your internet connection and try again.
                </Text>

                {/* Divider Line */}
                <View style={styles.divider} />

                {/* Actions */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => navigation.goBack()} // Or a specific retry logic
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.dashboardButton}
                        onPress={() => navigation.navigate('MainTabs')} // Go to home
                    >
                        <Text style={styles.dashboardButtonText}>Return to Dashboard</Text>
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
        paddingHorizontal: 30,
        paddingBottom: 60, // Shift content up slightly visually
    },
    iconContainer: {
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rippleOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#FFEBEE', // Very light red/pink
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    rippleInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    errorIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFCDD2', // Lighter red
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 30,
        paddingHorizontal: 10,
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 40,
    },
    actionContainer: {
        width: '100%',
        alignItems: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary, // Blue
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dashboardButton: {
        paddingVertical: 10,
    },
    dashboardButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default UploadErrorScreen;
