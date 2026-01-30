import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const InsightDetailScreen = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { titleKey, descKey, fullDescKey, imageSource, color } = route.params;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: color || '#FFF' }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('health_insights')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>{t(titleKey)}</Text>
                    <Text style={styles.subtitle}>{t(descKey)}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.fullDescription}>
                        {t(fullDescKey)}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        paddingBottom: 40,
    },
    imageContainer: {
        width: width,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    heroImage: {
        width: width * 0.9,
        height: 280,
    },
    textContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 24,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
        marginBottom: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginBottom: 20,
    },
    fullDescription: {
        fontSize: 16,
        color: '#444',
        lineHeight: 28,
        textAlign: 'justify',
    },
});

export default InsightDetailScreen;
