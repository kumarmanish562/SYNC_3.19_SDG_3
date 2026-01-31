import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../services/firebaseConfig';
import { ref, get } from 'firebase/database';

const { width } = Dimensions.get('window');

const ResultScreen = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { score = 15, status, timestamp, trendSuggestion, coughType = "N/A", explanation, probability } = route.params || {};

    const [history, setHistory] = useState([]);
    const [trendAnalysis, setTrendAnalysis] = useState('');
    const [previousScan, setPreviousScan] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const riskScore = score;
    const isInvalid = status === 'Invalid' || score === 0;
    const isLowRisk = riskScore < 30 && !isInvalid;
    const isHighRisk = riskScore > 70;

    let riskLabel = t('risk_low');
    let riskColor = "#2ECC71"; // Green
    let riskBg = "#E8F8F5";

    if (isInvalid) {
        riskLabel = "No Cough Detected";
        riskColor = "#9E9E9E";
        riskBg = "#F5F5F5";
    } else if (isHighRisk) {
        riskLabel = t('risk_high');
        riskColor = "#FF5252";
        riskBg = "#FFEBEE";
    } else if (!isLowRisk) {
        riskLabel = t('risk_medium');
        riskColor = "#FF9800";
        riskBg = "#FFF3E0";
    }

    const resultDate = timestamp ? new Date(timestamp) : new Date();
    // Real-time Date and Time representation
    const analysisDateStr = resultDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
    const analysisTimeStr = resultDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

    const aiConfidence = probability ? `${Math.round(probability * 100)}%` : "N/A";

    useEffect(() => {
        const fetchHistory = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    const reportsRef = ref(db, 'reports/' + currentUser.uid);
                    const snapshot = await get(reportsRef);
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const reports = Object.values(data).map(item => ({
                            ...item,
                            dateObject: new Date(item.timestamp)
                        }));

                        reports.sort((a, b) => a.dateObject - b.dateObject);

                        const fourteenDaysAgo = new Date();
                        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

                        const recentReports = reports.filter(r => r.dateObject >= fourteenDaysAgo);
                        setHistory(recentReports);

                        if (recentReports.length > 1) {
                            const previousReports = recentReports.filter(r => Math.abs(r.dateObject - resultDate) > 1000);
                            const lastReport = previousReports[previousReports.length - 1];

                            if (lastReport) {
                                setPreviousScan({
                                    score: lastReport.score,
                                    date: lastReport.dateObject,
                                    status: lastReport.status
                                });

                                const diff = riskScore - lastReport.score;
                                if (Math.abs(diff) < 5) {
                                    setTrendAnalysis("Status is stable vs previous scan.");
                                } else if (diff < 0) {
                                    setTrendAnalysis(`Improved by ${Math.abs(diff)} points.`);
                                } else {
                                    setTrendAnalysis(`Risk increased by ${diff} points.`);
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error fetching history:", error);
                }
            }
            setLoadingHistory(false);
        };

        fetchHistory();
    }, [score, timestamp]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('result_header')}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.scoreSection}>
                    <View style={styles.ringContainer}>
                        <View style={[styles.ring, { borderColor: '#E0E0E0' }]} />
                        <View style={[styles.ringOverlay, {
                            borderTopColor: riskColor,
                            borderRightColor: riskColor,
                            transform: [{ rotate: `${(riskScore / 100) * 360 - 90}deg` }]
                        }]} />

                        <View style={styles.scoreTextContainer}>
                            <Text style={styles.scoreLabel}>{t('risk_score')}</Text>
                            <Text style={styles.scoreValue}>{riskScore}%</Text>
                        </View>
                    </View>

                    <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
                        <View style={[styles.riskIcon, { backgroundColor: riskColor }]}>
                            <Ionicons name="checkmark" size={12} color="#FFF" />
                        </View>
                        <Text style={[styles.riskText, { color: riskColor }]}>{riskLabel}</Text>
                    </View>
                </View>

                {/* 3-Column Real-time Details (Prominent) */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailCard}>
                        <MaterialCommunityIcons name="water" size={20} color={colors.primary} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Type</Text>
                        <Text style={styles.detailValue}>{coughType}</Text>
                    </View>
                    <View style={styles.detailCard}>
                        <MaterialCommunityIcons name="shield-check" size={20} color={colors.primary} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Confidence</Text>
                        <Text style={styles.detailValue}>{aiConfidence}</Text>
                    </View>
                    <View style={styles.detailCard}>
                        <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primary} style={{ marginBottom: 4 }} />
                        <Text style={styles.detailLabel}>Date</Text>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.detailValue}>{analysisDateStr}</Text>
                            <Text style={[styles.detailValue, { fontSize: 11, color: '#666' }]}>{analysisTimeStr}</Text>
                        </View>
                    </View>
                </View>

                {/* Box 1: Past vs Present (Comparative) */}
                <View style={[styles.card, { backgroundColor: '#F3E5F5', borderColor: '#E1BEE7' }]}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="compare" size={22} color="#8E24AA" />
                        <Text style={[styles.cardTitle, { color: "#8E24AA" }]}>Past vs Present</Text>
                    </View>

                    {loadingHistory ? (
                        <Text style={styles.cardBody}>Analyzing history...</Text>
                    ) : (
                        <View>
                            <View style={styles.comparisonRow}>
                                <View style={styles.comparisonItem}>
                                    <Text style={styles.compLabel}>PREVIOUS</Text>
                                    <Text style={styles.compValue}>
                                        {previousScan ? `${previousScan.score}%` : "N/A"}
                                    </Text>
                                    <Text style={styles.compDate}>
                                        {previousScan ? new Date(previousScan.date).toLocaleDateString() : "-"}
                                    </Text>
                                </View>

                                <Ionicons name="arrow-forward" size={24} color="#8E24AA" style={{ opacity: 0.5 }} />

                                <View style={styles.comparisonItem}>
                                    <Text style={styles.compLabel}>CURRENT</Text>
                                    <Text style={styles.compValue}>{riskScore}%</Text>
                                    <Text style={styles.compDate}>Today</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <Text style={[styles.cardBody, { color: '#4A148C', fontWeight: 'bold', textAlign: 'center' }]}>
                                {trendAnalysis || "First entry this period."}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Box 2: Full Detailed Analysis */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="text-box-search-outline" size={22} color={colors.primary} />
                        <Text style={styles.cardTitle}>Detailed Analysis</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        {explanation || (isLowRisk
                            ? "The audio analysis detected sounds consistent with clear respiratory patterns. No significant anomalies were identified matching known cough pathologies."
                            : (isHighRisk
                                ? "High-risk indicators detected. The audio pattern shows strong similarities to validated pathology signatures. Immediate medical consultation is recommended."
                                : "Moderate risk indicators detected. Some audio segments show irregularities. Continued monitoring is advised."
                            )
                        )}
                    </Text>
                    {trendSuggestion && (
                        <Text style={[styles.cardBody, { marginTop: 8, fontStyle: 'italic' }]}>
                            <Text style={{ fontWeight: 'bold' }}>Suggestion: </Text>{trendSuggestion}
                        </Text>
                    )}
                </View>

                {/* 14-Day History Chart */}
                {!loadingHistory && history.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="chart-bar" size={20} color={colors.primary} />
                            <Text style={styles.cardTitle}>Last 14 Days Trend</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            {history.slice(-7).map((item, index) => (
                                <View key={index} style={styles.chartBarContainer}>
                                    <View style={[styles.chartBar, {
                                        height: Math.max(10, item.score * 0.8),
                                        backgroundColor: item.score > 70 ? '#FF5252' : (item.score > 30 ? '#FF9800' : '#2ECC71')
                                    }]} />
                                    <Text style={styles.chartDateLabel}>
                                        {new Date(item.timestamp).getDate()}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('ReportDetails', { score, status, timestamp, trendSuggestion, coughType, explanation })}
                    >
                        <Ionicons name="document-text-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryBtnText}>{t('view_detailed_report')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: '#F9F9F9' }]}
                        onPress={() => navigation.navigate('NearbyClinics')}
                    >
                        <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.secondaryBtnText}>{t('find_nearby_clinics')}</Text>
                    </TouchableOpacity>
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
        paddingVertical: 10,
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
    scoreSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    ringContainer: {
        width: 220,
        height: 220,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    ring: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 15,
        borderColor: '#F0F0F0',
    },
    ringOverlay: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 15,
        borderColor: 'transparent',
    },
    scoreTextContainer: {
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 1,
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
    riskBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    riskIcon: {
        width: 16,
        height: 16,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    riskText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#000',
    },
    cardBody: {
        fontSize: 14,
        color: colors.secondaryText,
        lineHeight: 22,
        marginBottom: 0,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 100,
        paddingTop: 10,
    },
    chartBarContainer: {
        alignItems: 'center',
    },
    chartBar: {
        width: 12,
        borderRadius: 6,
        marginBottom: 4,
    },
    chartDateLabel: {
        fontSize: 10,
        color: '#999',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 10,
    },
    detailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    actionsContainer: {
        gap: 16,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    secondaryBtnText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    comparisonItem: {
        alignItems: 'center',
    },
    compLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#8E24AA',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    compValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4A148C',
    },
    compDate: {
        fontSize: 11,
        color: '#8E24AA',
        opacity: 0.7,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E1BEE7',
        opacity: 0.5,
        marginBottom: 16,
    },
});

export default ResultScreen;
