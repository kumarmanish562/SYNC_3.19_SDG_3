import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const AboutScreen = ({ navigation }) => {

    const LinkItem = ({ icon, title, onPress, isExternal }) => (
        <TouchableOpacity style={styles.linkItem} onPress={onPress}>
            <View style={styles.linkLeft}>
                <View style={styles.iconBox}>
                    <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.linkTitle}>{title}</Text>
            </View>
            <Ionicons
                name={isExternal ? "open-outline" : "chevron-forward"}
                size={20}
                color="#CCC"
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="lungs" size={48} color={colors.primary} />
                    </View>
                    <Text style={styles.appName}>TB-SCAN</Text>
                    <Text style={styles.version}>Version 1.0.2</Text>
                </View>

                {/* Description */}
                <Text style={styles.description}>
                    TB-SCAN is dedicated to providing accessible early tuberculosis screening. Using advanced AI-powered cough audio analysis, we aim to empower communities with fast and reliable health assessments.
                </Text>

                {/* Links */}
                <View style={styles.linksContainer}>
                    <LinkItem
                        icon="shield-check-outline"
                        title="Privacy Policy"
                        onPress={() => { }}
                    />
                    <LinkItem
                        icon="gavel"
                        title="Terms of Service"
                        onPress={() => { }}
                    />
                    <LinkItem
                        icon="web"
                        title="Support Website"
                        onPress={() => { }}
                        isExternal
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2024 TB-SCAN Health Systems Inc.</Text>
                    <Text style={styles.rights}>All rights reserved.</Text>
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
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 24,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 20,
        backgroundColor: '#E1F5FE', // Light blue
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    linksContainer: {
        marginBottom: 30,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 16,
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
    linkLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    linkTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    footer: {
        alignItems: 'center',
    },
    copyright: {
        fontSize: 12,
        color: '#CCC',
        marginBottom: 4,
    },
    rights: {
        fontSize: 12,
        color: '#CCC',
    },
});

export default AboutScreen;
