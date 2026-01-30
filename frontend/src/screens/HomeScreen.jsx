import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { auth, db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [userName, setUserName] = useState('User');
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserName(currentUser.displayName || currentUser.email.split('@')[0] || 'User');

            const reportsRef = ref(db, 'reports/' + currentUser.uid);
            const unsubscribe = onValue(reportsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const reports = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
    }, [t]); // Add t as dependency if language changes re-rendering needed, though usually automatic

    const getRiskColor = (status) => {
        if (!status) return colors.primary;
        const lower = status.toLowerCase();
        if (lower.includes('invalid') || lower.includes('no cough')) return '#9E9E9E'; // Gray for invalid
        if (lower.includes('high')) return '#FF5252';
        if (lower.includes('medium')) return '#FF9800';
        return '#2ECC71';
    };

    const formatDateRange = (isoDate) => {
        if (!isoDate) return 'Today';
        const date = new Date(isoDate);
        const month = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`; // E.g., July 25
    };

    const renderActivityCard = (item) => {
        const riskColor = getRiskColor(item.status);
        const dateStr = formatDateRange(item.timestamp);

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
                <View style={[styles.iconCircle, { backgroundColor: riskColor + '20' }]}>
                    <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={riskColor} />
                </View>
                <Text style={styles.activityDate}>{dateStr}</Text>
                <Text style={[styles.activityStatus, { color: riskColor }]}>{item.status || 'Low Risk'}</Text>
            </TouchableOpacity>
        );
    };

    // Insights Data - now using real images
    const insightsData = [
        {
            id: 1,
            titleKey: "tip_1_title",
            descKey: "tip_1_desc",
            fullDescKey: "tip_1_full",
            color: '#E3F2FD',
            image: require('../../assets/tb_insight.png')
        },
        {
            id: 2,
            titleKey: "tip_2_title",
            descKey: "tip_2_desc",
            fullDescKey: "tip_2_full",
            color: '#FFF3E0',
            image: require('../../assets/lung_insight.png')
        },
        {
            id: 3,
            titleKey: "tip_3_title",
            descKey: "tip_3_desc",
            fullDescKey: "tip_3_full",
            color: '#E8F5E9',
            image: require('../../assets/ai_insight.png')
        }
    ];

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
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
                        <Text style={styles.greetingText}>{t('hello')},</Text>
                        <Text style={styles.userNameText}>{userName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <View style={styles.avatarContainer}>
                            {/* Placeholder generic user image if no photoURL */}
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('recent_activity')}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History')}>
                        <Text style={styles.seeAllText}>{t('see_all')}</Text>
                    </TouchableOpacity>
                </View>

                {recentActivity.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {recentActivity.map(renderActivityCard)}
                        <View style={{ width: 20 }} />
                    </ScrollView>
                ) : (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>{t('no_recent_scan')}</Text>
                        <TouchableOpacity style={styles.startScanBtn} onPress={() => navigation.navigate('RecordCough')}>
                            <Text style={styles.startScanText}>{t('start_new_scan')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Health Insights Section */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={styles.sectionTitle}>{t('health_insights')}</Text>
                </View>

                {/* Vertical List of Insight Cards */}
                <View style={styles.insightsList}>
                    {insightsData.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.insightBigCard, { backgroundColor: item.color }]}
                            onPress={() => navigation.navigate('InsightDetail', {
                                titleKey: item.titleKey,
                                descKey: item.descKey,
                                fullDescKey: item.fullDescKey,
                                imageSource: item.image,
                                color: item.color
                            })}
                        >
                            {/* Illustration Area */}
                            <View style={styles.cardImageContainer}>
                                <Image
                                    source={item.image}
                                    style={{ width: 70, height: 70 }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Text Content */}
                            <View style={styles.cardTextContent}>
                                <Text style={styles.cardTitle}>{t(item.titleKey)}</Text>
                                <Text style={styles.cardSameSubtitle}>{t(item.descKey)}</Text>
                            </View>

                            {/* Arrow Button */}
                            <View style={styles.arrowBtn}>
                                <Ionicons name="arrow-forward" size={20} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

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
        paddingTop: 10,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greetingText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    userNameText: {
        fontSize: 26,
        color: '#0288D1',
        fontWeight: 'bold',
        marginTop: 4,
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F0F0',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E1F5FE',
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
        color: '#1A237E', // Darker blue
    },
    seeAllText: {
        fontSize: 14,
        color: '#0288D1',
        fontWeight: '600',
    },
    horizontalScroll: {
        paddingLeft: 20,
        marginBottom: 10,
    },
    activityCard: {
        width: 140,
        height: 160,
        backgroundColor: '#F9F9F9',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    activityDate: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 6,
    },
    activityStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyStateContainer: {
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        borderRadius: 12,
    },
    emptyStateText: {
        color: '#777',
        fontSize: 14,
        marginBottom: 12,
    },
    startScanBtn: {
        backgroundColor: '#0288D1',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    startScanText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    insightsList: {
        paddingHorizontal: 20,
        gap: 16,
    },
    insightBigCard: {
        width: '100%',
        height: 120,
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cardImageContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTextContent: {
        flex: 1,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 6,
    },
    cardSameSubtitle: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
    },
    arrowBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#0288D1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
});

export default HomeScreen;
