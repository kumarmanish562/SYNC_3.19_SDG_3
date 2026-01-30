import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#FFFFFF' }
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            {/* Add other screens here as needed, e.g., Login, Dashboard */}
        </Stack.Navigator>
    );
};

export default AppNavigator;
