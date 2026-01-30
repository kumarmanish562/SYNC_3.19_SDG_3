import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondaryText,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: '#FFFFFF',
                    borderTopColor: '#F0F0F0',
                    borderTopWidth: 1,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                }
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
