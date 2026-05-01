import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MyWeddingsScreen from '../screens/wedding/MyWeddingsScreen';
import MyTasksScreen from '../screens/task/MyTasksScreen';
import MembersScreen from '../screens/members/MembersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0,
          elevation: 10,
          backgroundColor: '#fff',
        },
        tabBarActiveTintColor: '#6D2E46',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6,
        },
      }}
    >
      {/* 🏠 Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />

      {/* 💍 Weddings */}
      <Tab.Screen
        name="Weddings"
        component={MyWeddingsScreen}
        options={{
          tabBarLabel: 'Weddings',
          tabBarIcon: () => <Text>💍</Text>,
        }}
      />

      {/* 📝 Tasks (REAL SCREEN NOW) */}
      <Tab.Screen
        name="TasksTab"
        component={MyTasksScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: () => <Text>📝</Text>,
        }}
      />

      {/* 👨‍👩‍👧‍👦 Members (later) */}
      <Tab.Screen
        name="MembersTab"
        component={MembersScreen}
        options={{
          tabBarLabel: 'Members',
          tabBarIcon: () => <Text>👨‍👩‍👧‍👦</Text>,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
