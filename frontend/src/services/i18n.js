import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';
import mr from '../locales/mr.json';

const resources = {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
    mr: { translation: mr },
};

const getLanguage = async () => {
    try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
            return savedLanguage;
        }

        // Fallback to device locale if needed
        // For simplicity we default to 'en' in this demo
        return 'en';
    } catch (error) {
        return 'en';
    }
};

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: async (callback) => {
        const savedLanguage = await getLanguage();
        callback(savedLanguage);
    },
    init: () => { },
    cacheUserLanguage: async (language) => {
        try {
            await AsyncStorage.setItem('language', language);
        } catch (error) {
        }
    },
};

i18n
    .use(initReactI18next)
    .use(languageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
