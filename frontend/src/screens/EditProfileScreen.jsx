import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

import { auth, db } from '../services/firebaseConfig';
import { ref, update, onValue } from 'firebase/database';
import { signOut } from 'firebase/auth';

const EditProfileScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [mobile, setMobile] = useState("");

    // Load initial data
    React.useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userRef = ref(db, 'users/' + currentUser.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setName(data.username || currentUser.displayName || "");
                    setEmail(data.email || currentUser.email || "");
                    setDob(data.dob || "");
                    setGender(data.gender || "");
                    setMobile(data.mobile || "");
                }
            }, { onlyOnce: true });
        }
    }, []);

    const handleSave = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                await update(ref(db, 'users/' + currentUser.uid), {
                    username: name,
                    dob: dob,
                    mobile: mobile,
                    gender: gender
                    // Email usually requires re-auth to change in Firebase Auth
                });
                navigation.goBack();
            } catch (error) {
                console.error("Update failed", error);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            });
        } catch (error) {
            console.error(error);
        }
    };

    const InputField = ({ label, value, onChangeText, icon, rightIcon, editable = true }) => (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputWrapper, !editable && { backgroundColor: '#F5F5F5' }]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={`Enter ${label}`}
                    editable={editable}
                />
                {(icon || rightIcon) && (
                    <Ionicons name={icon || rightIcon} size={20} color={colors.primary} />
                )}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 28 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarCircle}>
                                <Ionicons name="person" size={50} color="#FFF" />
                            </View>
                            <TouchableOpacity style={styles.cameraButton}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <InputField
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        rightIcon="person"
                    />

                    <InputField
                        label="Email Address (Cannot change)"
                        value={email}
                        onChangeText={setEmail}
                        rightIcon="mail"
                        editable={false}
                    />

                    <InputField
                        label="Mobile Number"
                        value={mobile}
                        onChangeText={setMobile}
                        rightIcon="call"
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={dob}
                                onChangeText={setDob}
                                placeholder="MM/DD/YYYY"
                            />
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                value={gender} // Simplify to text input for speed
                                onChangeText={setGender}
                                placeholder="Male / Female"
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="people" size={20} color={colors.primary} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout from TB-SCAN</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#A5D6A7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    changePhotoText: {
        color: colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        paddingVertical: 0,
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutContainer: {
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 20,
    },
    logoutText: {
        color: '#FF5252',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 0.5,
    },
});

export default EditProfileScreen;
