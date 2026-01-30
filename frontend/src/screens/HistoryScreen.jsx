import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fetchHistory } from '../services/api';
import { auth } from '../services/firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const HistoryScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadHistory = async () => {
        if (auth.currentUser) {
            const res = await fetchHistory(auth.currentUser.uid);
            if (res.success) {
                setHistoryData(res.data);
            }
        }
        setLoading(false);
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadHistory();
    };

    const getRiskColor = (status) => {
        if (!status) return colors.primary;
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('high')) return '#E74C3C'; // Red
        if (lowerStatus.includes('medium')) return '#F39C12'; // Orange
        return '#2ECC71'; // Green (Low Risk)
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'Unknown Date';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredData = historyData.filter(item => {
        const query = searchQuery.toLowerCase();
        const dateStr = formatDate(item.timestamp).toLowerCase();
        const statusStr = (item.status || '').toLowerCase();
        return dateStr.includes(query) || statusStr.includes(query);
    });

    const renderTestCard = (item) => {
        const riskColor = getRiskColor(item.status);

        return (
            <View key={item.id} style={styles.card}>
                <View style={styles.cardContent}>
                    {/* Text Info */}
                    <View style={styles.infoContainer}>
                        <View style={styles.riskRow}>
                            <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
                            <Text style={[styles.riskText, { color: riskColor }]}>{item.status || "UNKNOWN"}</Text>
                        </View>

                        <Text style={styles.probabilityText}>{item.score}% Probability</Text>
                        <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>

                        <TouchableOpacity
                            style={styles.viewDetailsBtn}
                            onPress={() => navigation.navigate('Result', {
                                score: item.score,
                                status: item.status,
                                timestamp: item.timestamp
                            })}
                        >
                            <Text style={styles.viewDetailsText}>View Details</Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Image Placeholder - Visuals */}
                    <View style={[styles.imagePlaceholder, { backgroundColor: riskColor + '20' }]}>
                        {/* Visual based on risk */}
                        {item.status && item.status.toLowerCase().includes('high') ? (
                            <MaterialCommunityIcons name="bacteria-outline" size={40} color={riskColor} style={{ opacity: 0.8 }} />
                        ) : (
                            <MaterialCommunityIcons name="lungs" size={40} color={riskColor} style={{ opacity: 0.8 }} />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Test History</Text>
                <TouchableOpacity style={styles.filterButton} onPress={loadHistory}>
                    <Ionicons name="refresh" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

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

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Loading history...</Text>
                    </View>
                ) : filteredData.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="history" size={60} color="#DDD" />
                        <Text style={styles.emptyText}>No test history found.</Text>
                        <Text style={styles.emptySubText}>Records will appear here after you analyze a cough.</Text>
                    </View>
                ) : (
                    <>
                        {/* We could split by date (Recent vs Last Month) but for now just a list is fine */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>ALL TESTS ({filteredData.length})</Text>
                        </View>
                        {filteredData.map(renderTestCard)}
                    </>
                )}

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
        flexGrow: 1, // Ensure empty state centers vertically
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    loadingText: {
        marginTop: 10,
        color: '#999',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});

export default HistoryScreen;
