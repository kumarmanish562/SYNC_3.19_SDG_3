import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Share, Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ReportDetailsScreen = ({ navigation, route }) => {
    const { t } = useTranslation();

    // Get real data from route params
    const {
        score = 15,
        status = 'low_risk',
        timestamp,
        trendSuggestion = "",
        coughType = "N/A",
        explanation = ""
    } = route.params || {};

    const riskPercentage = score;
    const resultDate = timestamp ? new Date(timestamp) : new Date();
    const dateFormatted = resultDate.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    const timeFormatted = resultDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

    const isLowRisk = riskPercentage < 30;
    const isHighRisk = riskPercentage > 70;

    const getRiskLabel = () => {
        if (status && status !== 'Pending') return status;
        if (isHighRisk) return t('risk_high');
        if (riskPercentage > 30) return t('risk_medium');
        return t('risk_low');
    };

    const handleDownloadPDF = async () => {
        try {
            const html = `
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                    <style>
                      body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                      .header-table { width: 100%; border-bottom: 2px solid ${colors.primary}; padding-bottom: 10px; margin-bottom: 30px; }
                      .report-title { font-size: 24px; font-weight: bold; color: ${colors.primary}; margin: 0; }
                      .meta-table { width: 100%; margin-bottom: 30px; border-collapse: collapse; }
                      .meta-label { font-size: 10px; color: #888; text-transform: uppercase; font-weight: bold; }
                      .meta-value { font-size: 14px; font-weight: bold; padding: 5px 0 15px 0; border-bottom: 1px solid #eee; }
                      .risk-section { background-color: #f8f9fa; padding: 25px; border-radius: 12px; text-align: center; margin-bottom: 30px; border: 1px solid #dee2e6; }
                      .risk-val { font-size: 48px; font-weight: bold; margin: 10px 0; }
                      .trend-section { background-color: #F0F7FF; padding: 20px; border-radius: 10px; border-left: 5px solid ${colors.primary}; margin-bottom: 30px; }
                      .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                      .disclaimer { font-size: 10px; color: #999; font-style: italic; margin-top: 50px; text-align: center; }
                    </style>
                  </head>
                  <body>
                    <table class="header-table">
                        <tr>
                            <td><h1 class="report-title">MEDICAL ANALYSIS REPORT</h1></td>
                            <td align="right"><p style="margin:0; font-size:12px; color:#666">CoughX AI Digital Health • Type: ${coughType}</p></td>
                        </tr>
                    </table>

                    <table class="meta-table">
                        <tr>
                            <td width="50%">
                                <div class="meta-label">Report ID</div>
                                <div class="meta-value">#CX-${timestamp ? timestamp.toString().slice(-6) : 'DEMO'}</div>
                            </td>
                            <td width="30%"></td>
                            <td width="20%" align="right">
                                <div class="meta-label">Date/Time</div>
                                <div class="meta-value">${dateFormatted} ${timeFormatted}</div>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%">
                                <div class="meta-label">Patient Record</div>
                                <div class="meta-value">User: ${route.params?.userId || 'Authorized User'}</div>
                            </td>
                            <td width="30%"></td>
                            <td width="20%" align="right">
                                <div class="meta-label">Type</div>
                                <div class="meta-value">Respiratory Scan</div>
                            </td>
                        </tr>
                    </table>
                    
                    <div class="risk-section">
                        <div class="meta-label">${t('report_risk_level')}</div>
                        <div class="risk-val">${riskPercentage}%</div>
                        <div style="font-weight: bold; color: ${isLowRisk ? '#2ECC71' : (isHighRisk ? '#FF5252' : '#FF9800')}">${getRiskLabel().toUpperCase()}</div>
                    </div>

                    ${trendSuggestion ? `
                    <div class="section-title">Clinical Trend Analysis</div>
                    <div class="trend-section">
                        <p style="margin: 0; font-style: italic;">"${trendSuggestion}"</p>
                    </div>
                    ` : ''}

                    <div class="section-title">${t('report_summary_title')}</div>
                    <p>${explanation ? explanation : t('report_summary_text')}</p>

                    <div class="section-title">${t('report_recommendation_title')}</div>
                    <ul style="padding-left: 20px">
                        <li><strong>Monitor Symptoms</strong>: Continue to track your cough frequency and any associated fever or weight loss.</li>
                        <li><strong>Clinical Consultation</strong>: This is an AI-assisted baseline. Please consult a qualified physician for a definitive diagnosis.</li>
                    </ul>

                    <div class="disclaimer">
                        ${t('report_disclaimer')}
                        <br/>
                        <center><b>Generated by CoughX AI (v1.0.0)</b></center>
                    </div>
                  </body>
                </html>
            `;

            const { uri } = await Print.printToFileAsync({ html });

            if (Platform.OS === 'android') {
                // Request directory permission for direct download
                const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (permissions.granted) {
                    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
                    const fileName = `CoughX_Report_${Date.now()}.pdf`;

                    try {
                        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
                            permissions.directoryUri,
                            fileName,
                            'application/pdf'
                        );
                        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
                        Alert.alert("Download Successful", `Medical report has been saved as ${fileName}`);
                    } catch (saveError) {
                        console.log("Direct Save Error:", saveError);
                        await Sharing.shareAsync(uri);
                    }
                } else {
                    // Fallback to share sheet if permission denied
                    await Sharing.shareAsync(uri);
                }
            } else {
                // iOS: System share sheet is the standard way to "Save to Files"
                await Sharing.shareAsync(uri, {
                    UTI: '.pdf',
                    mimeType: 'application/pdf',
                    dialogTitle: 'Save CoughX Report'
                });
            }

        } catch (error) {
            console.error("PDF Generation Error:", error);
            Alert.alert("Error", "Could not generate or save the PDF report.");
        }
    };

    const handleShareReport = async () => {
        try {
            const message = `${t('report_title')}\n` +
                `${t('report_risk_level')}: ${riskPercentage}% (${getRiskLabel()})\n` +
                `Cough Type: ${coughType}\n` +
                (trendSuggestion ? `AI Insight: ${trendSuggestion}\n\n` : '\n') +
                `Summary: ${explanation || t('report_summary_text')}\n\n` +
                `CoughX AI`;

            await Share.share({
                message,
            });
        } catch (error) {
            Alert.alert(t('alert_error'), "Failed to share report");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('report_title')}</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* formal header section */}
                <View style={styles.formalReportCard}>
                    <View style={styles.reportRow}>
                        <View>
                            <Text style={styles.formalLabel}>REPORT ID</Text>
                            <Text style={styles.formalValue}>#CX-{timestamp ? timestamp.toString().slice(-6) : 'N/A'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.formalLabel}>DATE & TIME</Text>
                            <Text style={styles.formalValue}>{dateFormatted} • {timeFormatted}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { marginVertical: 15 }]} />

                    <View style={styles.reportRow}>
                        <View>
                            <Text style={styles.formalLabel}>PATIENT NAME</Text>
                            <Text style={styles.formalValue}>User ID: {route.params?.userId || 'Demo User'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.formalLabel}>COUGH TYPE</Text>
                            <Text style={styles.formalValue}>{coughType}</Text>
                        </View>
                    </View>
                </View>

                {/* Main Risk Card - More compact for medical feel */}
                <View style={[styles.riskCard, { paddingVertical: 20 }]}>
                    <View style={styles.horizontalRisk}>
                        <View>
                            <Text style={styles.riskLabel}>{t('report_risk_level')}</Text>
                            <Text style={[styles.riskValue, { fontSize: 40, marginBottom: 0 }]}>{riskPercentage}%</Text>
                        </View>
                        <View style={[styles.riskBadge, { backgroundColor: isLowRisk ? '#E8F5E9' : (isHighRisk ? '#FFEBEE' : '#FFF3E0'), alignSelf: 'center' }]}>
                            <Text style={[styles.riskBadgeText, { color: isLowRisk ? '#2ECC71' : (isHighRisk ? '#FF5252' : '#FF9800') }]}>{getRiskLabel()}</Text>
                        </View>
                    </View>
                </View>

                {/* AI Trend Section - Formal Clinical Note style */}
                {trendSuggestion && (
                    <View style={styles.clinicalNoteBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="medical" size={16} color={colors.primary} />
                            <Text style={styles.clinicalNoteTitle}> CLINICAL TREND ANALYSIS</Text>
                        </View>
                        <Text style={styles.clinicalNoteText}>
                            {trendSuggestion}
                        </Text>
                    </View>
                )}

                {/* Summary Section */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="text-box-outline" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>{t('report_summary_title')}</Text>
                </View>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryText}>
                        {explanation ? explanation : t('report_summary_text')}
                    </Text>
                </View>

                {/* Recommendation Section */}
                <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>{t('report_recommendation_title')}</Text>
                </View>

                {/* Recommendation Cards */}
                <View style={styles.recommendationList}>
                    {/* Item 1 */}
                    <View style={styles.recommendationItem}>
                        <View style={[styles.recIconBox, { backgroundColor: '#E1F5FE' }]}>
                            <Ionicons name="analytics" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.recContent}>
                            <Text style={styles.recTitle}>{t('report_rec_1_title')}</Text>
                            <Text style={styles.recDesc}>
                                {t('report_rec_1_desc')}
                            </Text>
                        </View>
                    </View>

                    {/* Item 2 */}
                    <View style={styles.recommendationItem}>
                        <View style={[styles.recIconBox, { backgroundColor: '#E0F2F1' }]}>
                            <MaterialCommunityIcons name="shield-plus" size={24} color="#009688" />
                        </View>
                        <View style={styles.recContent}>
                            <Text style={styles.recTitle}>{t('report_rec_2_title')}</Text>
                            <Text style={styles.recDesc}>
                                {t('report_rec_2_desc')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Disclaimer */}
                <Text style={styles.disclaimerText}>
                    {t('report_disclaimer')}
                </Text>

                {/* Action Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.downloadButton} onPress={handleDownloadPDF}>
                        <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.actionButtonText}>{t('report_download')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton} onPress={handleShareReport}>
                        <Ionicons name="share-social-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.actionButtonText}>{t('report_share')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Back to Home Link */}
                <TouchableOpacity
                    style={styles.homeLink}
                    onPress={() => navigation.navigate('MainTabs')}
                >
                    <Text style={styles.homeLinkText}>{t('report_back_home')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5', // Light grey background for this screen as per partial view, or stick to white. Let's try slightly off-white/grey to make white cards pop.
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    dateText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    riskCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 30,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    horizontalRisk: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
    },
    formalReportCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formalLabel: {
        fontSize: 10,
        color: '#999',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    formalValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    clinicalNoteBox: {
        backgroundColor: '#F0F7FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#D1E8FF',
    },
    clinicalNoteTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primary,
        letterSpacing: 0.5,
    },
    clinicalNoteText: {
        fontSize: 14,
        color: '#44546A',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    riskLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        letterSpacing: 1.5,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    riskValue: {
        fontSize: 56,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    riskBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9', // Light green
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    riskIconCircle: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#2ECC71', // Green
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    riskBadgeText: {
        color: '#2ECC71',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 8,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    summaryText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
    },
    recommendationList: {
        marginBottom: 24,
    },
    recommendationItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    recIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    recContent: {
        flex: 1,
    },
    recTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    recDesc: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    disclaimerText: {
        fontSize: 10,
        color: '#AAA',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 16,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    actionButtonsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    downloadButton: {
        backgroundColor: colors.primary, // Blue
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    shareButton: {
        backgroundColor: '#26A69A', // Teal-ish green
        borderRadius: 30,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#26A69A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    homeLink: {
        padding: 12,
        alignItems: 'center',
    },
    homeLinkText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default ReportDetailsScreen;
