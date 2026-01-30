import React from 'react';
import { LogBox } from 'react-native';

// Suppress deprecated warning
LogBox.ignoreLogs(['Expo AV has been deprecated']);
LogBox.ignoreLogs(['Navigating to "Auth"']); // Ignore common nav warnings if any

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import MainTabNavigator from '../navigation/MainTabNavigator';
import RecordCoughScreen from '../screens/RecordCoughScreen';
import AnalyzingScreen from '../screens/AnalyzingScreen';
import ResultScreen from '../screens/ResultScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
import NearbyClinicsScreen from '../screens/NearbyClinicsScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import AboutScreen from '../screens/AboutScreen';
import MedicalDisclaimerScreen from '../screens/MedicalDisclaimerScreen';
import UploadErrorScreen from '../screens/UploadErrorScreen';
import MicrophoneAccessScreen from '../screens/MicrophoneAccessScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

import AuthScreen from '../screens/AuthScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Auth"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' },
                // Setup simple slide animation
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="RecordCough" component={RecordCoughScreen} />
            <Stack.Screen name="Analyzing" component={AnalyzingScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
            <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
            <Stack.Screen name="NearbyClinics" component={NearbyClinicsScreen} />
            <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="MedicalDisclaimer" component={MedicalDisclaimerScreen} />
            <Stack.Screen name="UploadError" component={UploadErrorScreen} />
            <Stack.Screen name="MicrophoneAccess" component={MicrophoneAccessScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            {/* Add other screens here as needed, e.g., Login, Dashboard */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
