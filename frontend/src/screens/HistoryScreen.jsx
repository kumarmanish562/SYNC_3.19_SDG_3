import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const HistoryScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data based on the image
    const recentTests = [
        {
            id: 1,
            riskLevel: "LOW RISK",
            riskColor: "#2ECC71", // Green
            probability: "12%",
            date: "Oct 24, 2023 • 10:30 AM",
            imageType: "cell", // Placeholder for image type
            imageColor: "#FFCDD2" // Pinkish
        },
        {
            id: 2,
            riskLevel: "MEDIUM RISK",
            riskColor: "#FF9800", // Orange
            probability: "45%",
            date: "Sep 15, 2023 • 02:15 PM",
            imageType: "scan",
            imageColor: "#212121" // Dark/Black
        }
    ];

    const lastMonthTests = [
        {
            id: 3,
            riskLevel: "LOW RISK",
            riskColor: "#2ECC71",
            probability: "8%",
            date: "Aug 02, 2023 • 09:45 AM",
            imageType: "glass",
            imageColor: "#263238" // Dark Grey
        },
        {
            id: 4,
            riskLevel: "LOW RISK",
            riskColor: "#2ECC71",
            probability: "5%",
            date: "Jul 18, 2023 • 11:05 AM",
            imageType: "blue",
            imageColor: "#0277BD" // Blue
        }
    ];

    const renderTestCard = (item) => (
        <View key={item.id} style={styles.card}>
            <View style={styles.cardContent}>
                {/* Text Info */}
                <View style={styles.infoContainer}>
                    <View style={styles.riskRow}>
                        <View style={[styles.riskDot, { backgroundColor: item.riskColor }]} />
                        <Text style={[styles.riskText, { color: item.riskColor }]}>{item.riskLevel}</Text>
                    </View>

                    <Text style={styles.probabilityText}>{item.probability} Probability</Text>
                    <Text style={styles.dateText}>{item.date}</Text>

                    <TouchableOpacity
                        style={styles.viewDetailsBtn}
                        onPress={() => navigation.navigate('ReportDetails')}
                    // Assuming reusing ReportDetails for any history item
                    >
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Image Placeholder - Visuals */}
                <View style={[styles.imagePlaceholder, { backgroundColor: item.imageColor }]}>
                    {/* Simulating content based on type */}
                    {item.imageType === 'cell' && (
                        <MaterialCommunityIcons name="bacteria-outline" size={40} color="#E91E63" style={{ opacity: 0.8 }} />
                    )}
                    {item.imageType === 'scan' && (
                        <MaterialCommunityIcons name="head-snowflake-outline" size={40} color="#4FC3F7" style={{ opacity: 0.8 }} />
                    )}
                    {item.imageType === 'glass' && (
                        <MaterialCommunityIcons name="glass-fragile" size={40} color="#80DEEA" style={{ opacity: 0.8 }} />
                    )}
                    {item.imageType === 'blue' && (
                        <View style={{ width: '100%', height: '100%', opacity: 0.3, backgroundColor: '#FFF' }} />
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Test History</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <MaterialCommunityIcons name="filter-variant" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by date or result..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Recent Tests Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT TESTS</Text>
                </View>
                {recentTests.map(renderTestCard)}

                {/* Last Month Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>LAST MONTH</Text>
                </View>
                {lastMonthTests.map(renderTestCard)}

                {/* Padding for bottom tab bar */}
                <View style={{ height: 20 }} />

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
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        padding: 4,
    },
    filterButton: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    sectionHeader: {
        marginBottom: 16,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        overflow: 'hidden',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
        paddingRight: 16,
    },
    riskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    riskDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    riskText: {
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    probabilityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
    },
    viewDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1F5FE', // Light blue bg for button
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    viewDetailsText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        marginRight: 4,
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HistoryScreen;
