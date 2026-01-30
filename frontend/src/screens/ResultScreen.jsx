import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const ResultScreen = ({ navigation, route }) => {
    // Get params from navigation
    const { score = 15, status } = route.params || {};

    const riskScore = score;
    const isLowRisk = riskScore < 30; // 0-30 Low, 31-70 Medium, 71+ High
    const isHighRisk = riskScore > 70;

    let riskLabel = "Low Risk";
    let riskColor = "#2ECC71"; // Green
    let riskBg = "#E8F8F5";

    if (isHighRisk) {
        riskLabel = "High Risk";
        riskColor = "#FF5252";
        riskBg = "#FFEBEE";
    } else if (!isLowRisk) {
        riskLabel = "Medium Risk";
        riskColor = "#FF9800";
        riskBg = "#FFF3E0";
    }

    if (status && status !== 'Low Risk' && status !== 'Medium Risk' && status !== 'High Risk') {
        // use backend provided status if matched, or fallback to score logic
    }

    // Date/Method props
    const analysisDate = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const method = "AI Acoustic Analysis";

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Screening Result</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Score Circle Section */}
                <View style={styles.scoreSection}>
                    {/* 
                      Simulating a progress ring without SVG:
                      We'll just use a heavy border. To show "15%" specifically as a partial arc 
                      is difficult without SVG or specialized libraries.
                      We will use a full ring colored by risk level for now, 
                      or a static trick with two semi-circles if needed.
                      For simplicity and robustness, we use a solid ring color-coded to risk.
                    */}
                    <View style={styles.ringContainer}>
                        <View style={[styles.ring, { borderColor: '#E0E0E0' }]}>
                            {/* Background Ring */}
                        </View>
                        {/* 
                           A hack for partial progress:
                           We can overlay a rotated semi-circle. 
                           Since 15% is small, we can just show a top-right segment if we want, 
                           but a consistent colored ring is cleaner than a broken hack.
                           Let's stick to a colored ring that indicates status.
                        */}
                        <View style={[styles.ringOverlay, {
                            borderTopColor: colors.primary,
                            borderRightColor: colors.primary,
                            transform: [{ rotate: '-45deg' }] // Show roughly 25% progress visually
                        }]} />

                        <View style={styles.scoreTextContainer}>
                            <Text style={styles.scoreLabel}>RISK SCORE</Text>
                            <Text style={styles.scoreValue}>{riskScore}%</Text>
                        </View>
                    </View>

                    {/* Risk Badge */}
                    <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
                        <View style={[styles.riskIcon, { backgroundColor: riskColor }]}>
                            <Ionicons name="checkmark" size={12} color="#FFF" />
                        </View>
                        <Text style={[styles.riskText, { color: riskColor }]}>{riskLabel}</Text>
                    </View>
                </View>

                {/* Explanation Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="information" size={20} color={colors.primary} />
                        <Text style={styles.cardTitle}>Result Explanation</Text>
                    </View>
                    <Text style={styles.cardBody}>
                        Based on your symptoms and AI-powered cough analysis, your risk for Tuberculosis is currently low.
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.cardDisclaimer}>
                        Disclaimer: This is a screening tool, not a diagnosis. If you have a persistent cough or fever, please consult a medical professional.
                    </Text>
                </View>

                {/* Details Row */}
                <View style={styles.detailsRow}>
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>ANALYSIS DATE</Text>
                        <Text style={styles.detailValue}>{analysisDate}</Text>
                    </View>
                    <View style={styles.detailCard}>
                        <Text style={styles.detailLabel}>METHOD</Text>
                        <Text style={styles.detailValue}>{method}</Text>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('ReportDetails')}
                    >
                        <Ionicons name="document-text-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.primaryBtnText}>View Detailed Report</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('NearbyClinics')}
                    >
                        <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.secondaryBtnText}>Find Nearby Clinics</Text>
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
        borderColor: '#F0F0F0', // Light grey track
    },
    ringOverlay: {
        position: 'absolute',
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 15,
        borderColor: 'transparent',
        // Creating a partial arc look roughly
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
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginBottom: 16,
    },
    cardDisclaimer: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
        lineHeight: 18,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    detailCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        width: '48%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F5F5F5',
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
    },
    actionsContainer: {
        gap: 16, // Requires newer RN, if explicit gap fails, use marginBottom on buttons
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 30, // Pill shape
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
});

export default ResultScreen;
