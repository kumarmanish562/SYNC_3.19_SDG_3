import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

import { analyzeCough } from '../services/api';

const AnalyzingScreen = ({ route, navigation }) => {
    const { audioUri } = route.params || {};

    useEffect(() => {
        let isMounted = true;

        const performAnalysis = async () => {
            // Artificial delay for UX
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!audioUri) {
                // Testing fallback
                navigation.replace('Result', { score: 55, status: 'Simulated' });
                return;
            }

            try {
                const result = await analyzeCough(audioUri);

                if (isMounted) {
                    if (result && result.success) {
                        navigation.replace('Result', {
                            score: result.data.score,
                            status: result.data.status
                        });
                    } else {
                        // Handle error or fallback
                        navigation.replace('UploadError');
                    }
                }
            } catch (error) {
                console.error("Analysis Failed", error);
                if (isMounted) navigation.replace('UploadError');
            }
        };

        performAnalysis();

        return () => { isMounted = false; };
    }, [audioUri]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Central Analysis Graphic */}
                <View style={styles.graphicContainer}>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                            {/* Waveform Visualization simulating analysis */}
                            <View style={styles.waveformRow}>
                                {[...Array(7)].map((_, i) => (
                                    <View
                                        key={i}
                                        style={[
                                            styles.waveBar,
                                            {
                                                height: [20, 35, 50, 30, 45, 25, 20][i],
                                                backgroundColor: '#00C4CC' // Teal/Cyan color from image
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                    {/* Progress Ring / Loading Indicator */}
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={colors.primary} style={{ transform: [{ scale: 2 }] }} />
                        {/* Alternatively we could draw a custom SVG arc if easier, but ActivityIndicator around it or hidden might suffice for motion */}
                    </View>
                </View>

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Analyzing Cough Sample...</Text>
                    <Text style={styles.subtitle}>This may take a few seconds</Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>POWERED BY TB-SCAN AI</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0FAFF', // Very light blue background covering full screen
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    graphicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    outerCircle: {
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: '#E1F5FE', // Light blue ring
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B3E5FC',
    },
    innerCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    waveformRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    waveBar: {
        width: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    loadingOverlay: {
        position: 'absolute',
        width: 260,
        height: 260,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: colors.secondaryText,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
    },
    footerText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#4FC3F7', // Light blue footer text
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
});

export default AnalyzingScreen;
