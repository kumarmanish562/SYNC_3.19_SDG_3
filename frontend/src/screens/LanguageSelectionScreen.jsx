import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelectionScreen = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [selectedId, setSelectedId] = useState(i18n.language);

    useEffect(() => {
        setSelectedId(i18n.language);
    }, []);

    // Data for Indian Languages
    const languages = [
        { id: 'en', name: 'English', native: 'English', flag: '🇮🇳' },
        { id: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
        { id: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
        { id: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
        // Add more locales to i18n.js resources if you enable them here
    ];

    const handleSave = async () => {
        try {
            await i18n.changeLanguage(selectedId);
            await AsyncStorage.setItem('language', selectedId);
            Alert.alert("Success", "Language updated successfully", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('select_language')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
                {languages.map((lang) => {
                    const isSelected = selectedId === lang.id;
                    return (
                        <TouchableOpacity
                            key={lang.id}
                            style={[
                                styles.languageItem,
                                isSelected && styles.languageItemSelected
                            ]}
                            onPress={() => setSelectedId(lang.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.itemLeft}>
                                <Text style={styles.flag}>{lang.flag}</Text>
                                <View>
                                    <Text style={styles.languageName}>
                                        {lang.native} <Text style={styles.languageNameSub}>({lang.name})</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.radioOuter}>
                                {isSelected && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Footer Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>{t('save_selection')}</Text>
                </TouchableOpacity>
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
    listContainer: {
        padding: 20,
        paddingBottom: 100,
    },
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    languageItemSelected: {
        borderColor: colors.primary,
        backgroundColor: '#F0FAFF',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flag: {
        fontSize: 24,
        marginRight: 16,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    languageNameSub: {
        fontWeight: '400',
        color: '#777',
        fontSize: 14,
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LanguageSelectionScreen;
