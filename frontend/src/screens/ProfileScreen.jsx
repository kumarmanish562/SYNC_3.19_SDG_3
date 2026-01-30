import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { auth, db } from '../services/firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';

const ProfileScreen = ({ navigation }) => {
    // Real User Data State
    const [user, setUser] = React.useState({
        name: "Loading...",
        email: "...",
        mobile: "...",
        dob: "Not set",
        gender: "Not set",
    });

    // Stats State
    const [stats, setStats] = React.useState({
        screenings: 0,
        avgRisk: "N/A"
    });

    React.useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            // User Profile Listener
            const userRef = ref(db, 'users/' + currentUser.uid);
            const unsubscribeUser = onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUser({
                        name: data.username || currentUser.displayName || "User",
                        email: data.email || currentUser.email,
                        mobile: data.mobile || "Not set",
                        dob: data.dob || "Not set",
                        gender: data.gender || "Not set",
                        avatar: data.avatar || null
                    });
                }
            });

            // Reports/Stats Listener
            const reportsRef = ref(db, 'reports/' + currentUser.uid);
            const unsubscribeReports = onValue(reportsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const reports = Object.values(data);
                    const count = reports.length;

                    if (count > 0) {
                        const totalScore = reports.reduce((sum, item) => sum + (item.score || 0), 0);
                        const avgScore = totalScore / count;

                        let riskLabel = "Low";
                        if (avgScore > 70) riskLabel = "High";
                        else if (avgScore > 30) riskLabel = "Medium";

                        setStats({
                            screenings: count,
                            avgRisk: riskLabel
                        });
                    } else {
                        setStats({ screenings: 0, avgRisk: "N/A" });
                    }
                } else {
                    setStats({ screenings: 0, avgRisk: "N/A" });
                }
            });

            return () => {
                unsubscribeUser();
                unsubscribeReports();
            };
        }
    }, []);

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Card */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person" size={48} color="#FFF" />
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                        <Ionicons name="pencil" size={16} color="#FFF" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.card}>
                        <InfoRow icon="calendar-outline" label="Date of Birth" value={user.dob} />
                        <View style={styles.divider} />
                        <InfoRow icon="people-outline" label="Gender" value={user.gender} />
                        <View style={styles.divider} />
                        <InfoRow icon="mail-outline" label="Email Address" value={user.email} />
                        <View style={styles.divider} />
                        <InfoRow icon="call-outline" label="Mobile Number" value={user.mobile} />
                    </View>
                </View>

                {/* Stats / Other */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Statistics</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.screenings}</Text>
                            <Text style={styles.statLabel}>Screenings</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.avgRisk}</Text>
                            <Text style={styles.statLabel}>Avg Risk</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContent: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#A5D6A7', // Sage green from image
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    editButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
});

export default ProfileScreen;
