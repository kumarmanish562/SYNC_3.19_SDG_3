import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const NearbyClinicsScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);

            // Generate dummy hospitals around this location
            fetchNearbyClinics(loc.coords.latitude, loc.coords.longitude);
            setLoading(false);
        })();
    }, []);

    const fetchNearbyClinics = async (lat, lng) => {
        const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.warn("No Google Maps API Key found, using dummy data.");
            generateNearbyClinics(lat, lng);
            return;
        }

        try {
            const radius = 5000; // 5km
            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=hospital,clinic&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
                const realClinics = data.results.map((place) => {
                    const distKm = getDistanceFromLatLonInKm(lat, lng, place.geometry.location.lat, place.geometry.location.lng);
                    const isOpen = place.opening_hours ? place.opening_hours.open_now : true;

                    return {
                        id: place.place_id,
                        name: place.name,
                        status: isOpen ? "OPEN" : "CLOSED",
                        statusColor: isOpen ? "#4CAF50" : "#FF5252",
                        statusBg: isOpen ? "#E8F5E9" : "#FFEBEE",
                        distance: `${distKm.toFixed(1)} km`,
                        time: `${Math.ceil(distKm * 5)} mins`, // Approx driving time
                        address: place.vicinity,
                        phone: "Unavailable", // Requires 'Place Details' API
                        coordinates: {
                            latitude: place.geometry.location.lat,
                            longitude: place.geometry.location.lng
                        },
                        type: "Healthcare Provider",
                        rating: place.rating
                    };
                });

                setClinics(realClinics.slice(0, 10)); // Limit to 10
            } else {
                console.warn("Google Places API returned no results or error:", data.status);
                generateNearbyClinics(lat, lng);
            }
        } catch (error) {
            console.error("Error fetching places:", error);
            generateNearbyClinics(lat, lng);
        }
    };

    // Helper for Distance Calculation (Haversine)
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Fallback Dummy Generator
    const generateNearbyClinics = (lat, lng) => {
        const placeNames = ["City General Hospital", "Apex Pulmonary Center", "Community Health Clinic", "St. Luke's Respiratory Care"];
        const types = ["Hospital", "Specialist", "Clinic", "Hospital"];

        const newClinics = placeNames.map((name, index) => {
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lngOffset = (Math.random() - 0.5) * 0.02;
            const distance = (Math.sqrt(Math.pow(latOffset, 2) + Math.pow(lngOffset, 2)) * 111).toFixed(1);

            return {
                id: index + 1,
                name: name,
                status: "OPEN",
                statusColor: "#4CAF50",
                statusBg: "#E8F5E9",
                distance: `${distance} km away`,
                time: `${Math.ceil(distance * 10)} mins`,
                address: `Near your location`,
                phone: `555-010${index}`,
                coordinates: {
                    latitude: lat + latOffset,
                    longitude: lng + lngOffset
                },
                type: types[index]
            };
        });
        newClinics.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        setClinics(newClinics);
    };

    const filters = ["Open Now", "TB Screening", "Rating", "Distance"];

    const openMaps = (lat, lng, label) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const labelStr = label || 'Metric';
        const url = Platform.select({
            ios: `${scheme}${labelStr}@${latLng}`,
            android: `${scheme}${latLng}(${labelStr})`
        });
        Linking.openURL(url);
    };

    const handleCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10 }}>Finding nearby clinics...</Text>
            </SafeAreaView>
        );
    }

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
                    <Text style={styles.locationText}>
                        {errorMsg ? "Location Unavailable" : "Current Location"}
                    </Text>
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
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Interactive Map View */}
                <View style={styles.mapContainer}>
                    {location ? (
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            initialRegion={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                                latitudeDelta: 0.04,
                                longitudeDelta: 0.04,
                            }}
                            showsUserLocation={true}
                            showsMyLocationButton={true}
                        >
                            {clinics.map(clinic => (
                                <Marker
                                    key={clinic.id}
                                    coordinate={clinic.coordinates}
                                    title={clinic.name}
                                    description={clinic.type}
                                    pinColor={colors.primary}
                                />
                            ))}
                        </MapView>
                    ) : (
                        <View style={styles.mapError}>
                            <Text>{errorMsg || "Map loading..."}</Text>
                        </View>
                    )}
                </View>

                {/* List Header */}
                <View style={styles.listHeader}>
                    <Text style={styles.listTitle}>Clinics near you</Text>
                </View>

                {/* Clinics List */}
                <View style={styles.clinicsList}>
                    {clinics.map((clinic) => (
                        <View key={clinic.id} style={styles.clinicCard}>
                            {/* Card Header */}
                            <TouchableOpacity
                                style={styles.clinicHeader}
                                onPress={() => openMaps(clinic.coordinates.latitude, clinic.coordinates.longitude, clinic.name)}
                            >
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
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
                                    <MaterialCommunityIcons name="hospital-building" size={24} color={colors.primary} />
                                </View>
                            </TouchableOpacity>

                            {/* Actions */}
                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.callButton}
                                    onPress={() => handleCall(clinic.phone)}
                                >
                                    <Ionicons name="call" size={18} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.callButtonText}>Call</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.directionButton}
                                    onPress={() => openMaps(clinic.coordinates.latitude, clinic.coordinates.longitude, clinic.name)}
                                >
                                    <Text style={styles.directionText}>Directions</Text>
                                    <MaterialCommunityIcons name="directions" size={18} color={colors.primary} style={{ marginLeft: 4 }} />
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
    backButton: { padding: 4 },
    bellButton: { padding: 4 },
    scrollContent: { paddingBottom: 20 },
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
    filtersContent: { paddingRight: 20 },
    filterChip: {
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
    filterText: { fontSize: 13, fontWeight: '600' },
    activeFilterText: { color: '#FFFFFF' },
    inactiveFilterText: { color: '#333' },

    // Map Styles
    mapContainer: {
        marginHorizontal: 20,
        height: 250, // Taller map
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    mapError: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F0F0F0'
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
    clinicsList: { paddingHorizontal: 20 },
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
        marginBottom: 12,
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
        marginTop: 2
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    clinicMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    clinicIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#E1F5FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10
    },
    callButton: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
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
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default NearbyClinicsScreen;
