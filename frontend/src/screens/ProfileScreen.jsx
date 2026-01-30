import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const ProfileScreen = ({ navigation }) => {
    // Mock user data
    const user = {
        name: "Johnathan Doe",
        email: "john.doe@healthmail.com",
        dob: "05/15/1990",
        gender: "Male",
        avatar: null // potentially a uri if real
    };

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
                    </View>
                </View>

                {/* Stats / Other */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Statistics</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>12</Text>
                            <Text style={styles.statLabel}>Screenings</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>Low</Text>
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
