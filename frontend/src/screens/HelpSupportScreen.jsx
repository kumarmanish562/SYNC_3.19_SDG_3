import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const HelpSupportScreen = ({ navigation }) => {
    const { t } = useTranslation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('help_title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>{t('help_how_can_we_help')}</Text>
                <Text style={styles.description}>
                    {t('help_desc')}
                </Text>

                <TouchableOpacity style={styles.linkItem}>
                    <Text style={styles.linkText}>{t('help_faq')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkItem}>
                    <Text style={styles.linkText}>{t('help_contact')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkItem}>
                    <Text style={styles.linkText}>{t('help_report_bug')}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#CCC" />
                </TouchableOpacity>
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
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
        lineHeight: 20,
    },
    linkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    linkText: {
        fontSize: 16,
        color: '#333',
    },
});

export default HelpSupportScreen;
