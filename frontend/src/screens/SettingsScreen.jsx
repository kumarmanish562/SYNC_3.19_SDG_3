import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { auth } from '../services/firebaseConfig';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';

const SettingsScreen = ({ navigation }) => {
    const { t } = useTranslation();

    // Helper component for settings item
    const SettingsItem = ({ icon, title, subtitle, onPress, showToggle }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={showToggle} // If toggle, main press might be disabled or handle toggle
        >
            <View style={styles.itemLeft}>
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={22} color={colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>

            {showToggle ? (
                <Switch
                    trackColor={{ false: "#767577", true: colors.primary }}
                    thumbColor={"#f4f3f4"}
                    value={true}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
            )}
        </TouchableOpacity>
    );

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Reset navigation queue and go to Auth
            navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
            });
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('nav_settings')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* GENERAL Section */}
                <Text style={styles.sectionHeader}>{t('settings_general')}</Text>

                <SettingsItem
                    icon="globe-outline"
                    title={t('settings_language')}
                    subtitle={t('settings_language_current') || "English"}
                    onPress={() => navigation.navigate('LanguageSelection')}
                />

                <SettingsItem
                    icon="notifications-outline"
                    title={t('settings_notifications')}
                    subtitle={t('settings_enabled')}
                    onPress={() => navigation.navigate('Notifications')}
                />

                {/* INFORMATION & SUPPORT Section */}
                <Text style={styles.sectionHeader}>{t('settings_info_support')}</Text>

                <SettingsItem
                    icon="help-circle-outline"
                    title={t('settings_help_support')}
                    onPress={() => navigation.navigate('HelpSupport')}
                />

                <SettingsItem
                    icon="information-circle-outline"
                    title={t('settings_about')}
                    onPress={() => navigation.navigate('About')}
                />

                <SettingsItem
                    icon="shield-checkmark-outline"
                    title={t('settings_medical')}
                    onPress={() => navigation.navigate('MedicalDisclaimer')}
                />

                <SettingsItem
                    icon="lock-closed-outline"
                    title={t('settings_privacy')}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                />

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#FF5252" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>{t('settings_logout')}</Text>
                </TouchableOpacity>

                {/* Version Footer */}
                <View style={styles.footerContainer}>
                    <Text style={styles.versionText}>VERSION 2.4.0</Text>
                    <Text style={styles.copyrightText}>{t('copyright')}</Text>
                </View>

            </ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'bold',
        letterSpacing: 1,
        marginTop: 24,
        marginBottom: 12,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 8,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E1F5FE', // Light blue
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFEBEE', // Light red
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 30,
        marginBottom: 20,
    },
    logoutText: {
        color: '#FF5252',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    versionText: {
        fontSize: 12,
        color: '#999',
        letterSpacing: 1,
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 10,
        color: '#BBB',
    },
});

export default SettingsScreen;
