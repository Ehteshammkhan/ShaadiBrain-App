import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './AuthStack';
import BottomTabs from '../components/BottomTabs';

import CreateWeddingScreen from '../screens/wedding/CreateWeddingScreen';
import EventsScreen from '../screens/events/EventsScreen';
import EventTasksScreen from '../screens/task/EventTasksScreen';
import CreateTaskScreen from '../screens/task/CreateTaskScreen';
import TaskDetailsScreen from '../screens/task/TaskDetailsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import AddMemberScreen from '../screens/members/AddMemberScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const token = useAuthStore(state => state.token);

  // 🔐 NOT LOGGED IN
  if (!token) {
    return <AuthStack />;
  }

  // 🔓 LOGGED IN
  return (
    <Stack.Navigator>
      {/* 🏠 Bottom Tabs */}
      <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />

      {/* 💍 Wedding Flow */}
      <Stack.Screen
        name="CreateWedding"
        component={CreateWeddingScreen}
        options={{ title: 'Create Wedding' }}
      />

      <Stack.Screen
        name="AddMember"
        component={AddMemberScreen}
        options={{ title: 'Add Member' }}
      />

      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: 'Events' }}
      />

      {/* 📋 Tasks */}
      <Stack.Screen
        name="EventTasks"
        component={EventTasksScreen}
        options={{ title: 'Tasks' }}
      />

      <Stack.Screen
        name="CreateTask"
        component={CreateTaskScreen}
        options={{ title: 'Create Task' }}
      />

      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: 'Create Event' }}
      />

      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
