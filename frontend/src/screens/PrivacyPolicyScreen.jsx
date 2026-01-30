import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { useTranslation } from 'react-i18next';

const PrivacyPolicyScreen = ({ navigation }) => {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('privacy_title_header')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.lastUpdated}>{t('privacy_updated')}</Text>

                <Text style={styles.sectionTitle}>{t('privacy_sec_1')}</Text>
                <Text style={styles.paragraph}>
                    {t('privacy_sec_1_text')}
                </Text>

                <Text style={styles.sectionTitle}>{t('privacy_sec_2')}</Text>
                <Text style={styles.paragraph}>
                    {t('privacy_sec_2_text')}
                </Text>

                <Text style={styles.sectionTitle}>{t('privacy_sec_3')}</Text>
                <Text style={styles.paragraph}>
                    {t('privacy_sec_3_text')}
                </Text>

                {/* Add more sections as needed */}
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
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#999',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 12,
    },
});

export default PrivacyPolicyScreen;
