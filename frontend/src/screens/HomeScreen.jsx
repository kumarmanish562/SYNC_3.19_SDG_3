import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { auth, db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [userName, setUserName] = useState('User');
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email.split('@')[0] || 'User');

            // Real-time listener for reports
            const reportsRef = ref(db, 'reports/' + currentUser.uid);
            const unsubscribe = onValue(reportsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Convert object to array
                    const reports = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));

                    // Sort by timestamp desc
                    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    // Take top 5
                    setRecentActivity(reports.slice(0, 5));
                } else {
                    setRecentActivity([]);
                }
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setUserName('Guest');
            setRecentActivity([]);
            setLoading(false);
        }
    }, []);

    const getRiskColor = (status) => {
        if (!status) return colors.primary;
        const lower = status.toLowerCase();
        if (lower.includes('high')) return '#FF5252';
        if (lower.includes('medium')) return '#FF9800';
        return '#2ECC71'; // Green for Low Risk
    };

    const formatDateRange = (isoDate) => {
        if (!isoDate) return 'Today';
        const date = new Date(isoDate);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    };

    const renderActivityCard = (item) => {
        const riskColor = getRiskColor(item.status);

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.activityCard}
                onPress={() => navigation.navigate('Result', {
                    score: item.score,
                    status: item.status,
                    timestamp: item.timestamp
                })}
            >
                <View style={styles.iconCircle}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={colors.primary} />
                </View>
                <Text style={styles.activityDate}>{formatDateRange(item.timestamp)}</Text>
                <Text style={[styles.activityStatus, { color: riskColor }]}>{item.status || 'Low Risk'}</Text>
            </TouchableOpacity>
        );
    };

    const insightsData = [
        {
            id: 1,
            title: "Health Tips: Tuberculosis",
            subtitle: "Learn about prevention and early detection.",
            color: '#E0F7FA', // Light Cyan
            image: 'lungs'
        },
        {
            id: 2,
            title: "Understanding Your Lungs",
            subtitle: "How to maintain healthy respiratory function.",
            color: '#FFF3E0', // Light Orange
            image: 'doctor'
        }
    ];

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Real-time listener handles updates, so we just simulate a brief refresh
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greetingText}>{t('welcome')},</Text>
                        <Text style={styles.userNameText}>{userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        {/* Placeholder Avatar */}
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={24} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('history')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History')}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {recentActivity.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {recentActivity.map(renderActivityCard)}
                        <View style={{ width: 20 }} />
                    </ScrollView>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>No recent scans.</Text>
                        <TouchableOpacity style={styles.startScanBtn} onPress={() => navigation.navigate('RecordCough')}>
                            <Text style={styles.startScanText}>Start New Scan</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Health Insights Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitle}>Health Insights</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                    {insightsData.map((item) => (
                        <View key={item.id} style={[styles.insightCard, { backgroundColor: item.color }]}>
                            <View style={styles.insightContent}>
                                <Text style={styles.insightTitle}>{item.title}</Text>
                                <Text style={styles.insightSubtitle}>{item.subtitle}</Text>
                            </View>
                            <View style={styles.insightImagePlaceholder}>
                                <MaterialCommunityIcons
                                    name={item.image === 'lungs' ? 'lungs' : 'doctor'}
                                    size={40}
                                    color={colors.primary}
                                    style={{ opacity: 0.8 }}
                                />
                            </View>
                        </View>
                    ))}
                    <View style={{ width: 20 }} />
                </ScrollView>

                {/* Quick Action FAB (Simulating the Mic button from the design if Tab Bar isn't updated) */}
                {/* We won't add a floating button overlay here to avoid clashing with the tab bar if they are close, 
                    but we'll add a 'Record' card if the user needs primary access and the tab bar is standard. 
                    Actually, let's just stick to the content layout requested. */}

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    greetingText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    userNameText: {
        fontSize: 24,
        color: colors.primary, // Blue color from image
        fontWeight: 'bold',
    },
    avatarContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#CCC', // Placeholder gray
        justifyContent: 'center',
        alignItems: 'center',
        // In real app, use <Image source={{ uri: user.photoURL }} />
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    horizontalScroll: {
        paddingLeft: 20,
    },
    activityCard: {
        width: 130,
        height: 140,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        // Shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    activityDate: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    activityStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 2,
    },
    emptyStateContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    emptyStateText: {
        color: '#999',
        fontSize: 14,
        marginBottom: 12,
    },
    startScanBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    startScanText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    insightCard: {
        width: 260,
        height: 140, // Large rectangular card
        borderRadius: 20,
        padding: 20,
        marginRight: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
    },
    insightContent: {
        flex: 1,
        paddingRight: 10,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    insightSubtitle: {
        fontSize: 12,
        color: '#555',
        lineHeight: 18,
    },
    insightImagePlaceholder: {
        width: 70,
        height: 70,
        // backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
});

export default HomeScreen;
