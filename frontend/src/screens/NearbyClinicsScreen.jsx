import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const NearbyClinicsScreen = ({ navigation }) => {
    // Dummy Data for Clinics
    const clinics = [
        {
            id: 1,
            name: "City Health TB Center",
            status: "OPEN",
            statusColor: "#4CAF50", // Green
            statusBg: "#E8F5E9",
            distance: "0.8 km away",
            time: "12 mins",
            address: "123 Medical Plaza, Suite 400, Brooklyn, NY 11201",
            type: "TB Center"
        },
        {
            id: 2,
            name: "St. Mary's Respiratory",
            status: "CLOSING SOON",
            statusColor: "#FF9800", // Orange
            statusBg: "#FFF3E0",
            distance: "2.5 km away",
            time: "8 mins",
            address: "45 Respiratory Rd, Brooklyn, NY 11205",
            type: "Clinic"
        },
        {
            id: 3,
            name: "Brooklyn Lung Specialist",
            status: "OPEN",
            statusColor: "#4CAF50",
            statusBg: "#E8F5E9",
            distance: "3.2 km away",
            time: "15 mins",
            address: "88 Health Ave, Brooklyn, NY 11206",
            type: "Specialist"
        }
    ];

    const filters = ["Open Now", "TB Screening", "Rating", "Distance"];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nearby Clinics</Text>
                <TouchableOpacity style={styles.bellButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Location Bar */}
                <View style={styles.locationBar}>
                    <Ionicons name="location-sharp" size={20} color={colors.primary} />
                    <Text style={styles.locationText}>Brooklyn, NY</Text>
                    {/* Could add an edit icon or dropdown arrow here */}
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {filters.map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterChip,
                                index === 0 ? styles.activeFilter : styles.inactiveFilter
                            ]}
                        >
                            <Text style={[
                                styles.filterText,
                                index === 0 ? styles.activeFilterText : styles.inactiveFilterText
                            ]}>
                                {filter}
                            </Text>
                            <Ionicons
                                name="chevron-down"
                                size={12}
                                color={index === 0 ? "#FFF" : "#666"}
                                style={{ marginLeft: 4 }}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Map Placeholder */}
                <View style={styles.mapContainer}>
                    {/* Simulating Map View */}
                    <View style={styles.mapBackground}>
                        {/* Map Grid Lines */}
                        <View style={styles.mapGridHorizontal} />
                        <View style={styles.mapGridVertical} />

                        {/* Dummy Pins */}
                        <View style={[styles.mapPin, { top: 40, left: 100 }]}>
                            <MaterialCommunityIcons name="map-marker" size={32} color={colors.primary} />
                        </View>
                        <View style={[styles.mapPin, { top: 90, left: 220 }]}>
                            <MaterialCommunityIcons name="map-marker" size={32} color="#FF5252" />
                        </View>
                        <View style={[styles.mapPin, { top: 120, left: 60 }]}>
                            <MaterialCommunityIcons name="map-marker" size={32} color={colors.primary} />
                        </View>

                        {/* Location Button */}
                        <View style={styles.myLocationBtn}>
                            <Ionicons name="locate" size={20} color={colors.primary} />
                        </View>
                    </View>
                    <View style={styles.mapLabelOverlay}>
                        <Text style={styles.mapOverlayText}>New York</Text>
                    </View>
                </View>

                {/* List Header */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Clinics near you</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                {/* Clinics List */}
                <View style={styles.clinicsList}>
                    {clinics.map((clinic) => (
                        <View key={clinic.id} style={styles.clinicCard}>
                            {/* Card Header */}
                            <View style={styles.clinicHeader}>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.clinicName}>{clinic.name}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: clinic.statusBg }]}>
                                            <Text style={[styles.statusText, { color: clinic.statusColor }]}>{clinic.status}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.clinicMeta}>
                                        <Ionicons name="walk" size={14} color="#666" />
                                        <Text style={styles.metaText}>{clinic.distance} • {clinic.time}</Text>
                                    </View>
                                </View>
                                <View style={styles.clinicIconBox}>
                                    <MaterialCommunityIcons name="medical-bag" size={20} color={colors.primary} />
                                </View>
                            </View>

                            {/* Address */}
                            <View style={styles.addressRow}>
                                <Ionicons name="business" size={14} color="#999" />
                                <Text style={styles.addressText}>{clinic.address}</Text>
                            </View>

                            {/* Actions */}
                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.callButton}>
                                    <Ionicons name="call" size={18} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.callButtonText}>Call Clinic</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.directionButton}>
                                    <MaterialCommunityIcons name="directions" size={22} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
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
    bellButton: {
        padding: 4,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    locationBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    locationText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginLeft: 8,
    },
    filtersContainer: {
        paddingLeft: 20,
        marginBottom: 20,
    },
    filtersContent: {
        paddingRight: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    activeFilter: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    inactiveFilter: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#FFFFFF',
    },
    inactiveFilterText: {
        color: '#333',
    },
    mapContainer: {
        marginHorizontal: 20,
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    mapBackground: {
        flex: 1,
        backgroundColor: '#E3F2FD', // Light blue map water/bg
        position: 'relative',
    },
    mapGridHorizontal: {
        position: 'absolute',
        top: '40%',
        width: '100%',
        height: 4,
        backgroundColor: '#FFFFFF',
    },
    mapGridVertical: {
        position: 'absolute',
        left: '60%',
        height: '100%',
        width: 4,
        backgroundColor: '#FFFFFF',
    },
    mapPin: {
        position: 'absolute',
    },
    mapLabelOverlay: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    mapOverlayText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    myLocationBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: '#FFFFFF',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    viewAllText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    clinicsList: {
        paddingHorizontal: 20,
    },
    clinicCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    clinicHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    clinicMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    clinicIconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    addressText: {
        fontSize: 12,
        color: '#777',
        marginLeft: 6,
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    callButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    callButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    directionButton: {
        width: 48,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NearbyClinicsScreen;
