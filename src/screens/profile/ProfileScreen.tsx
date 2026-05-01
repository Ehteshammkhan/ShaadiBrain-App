import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Header from '../../components/Header';
import { useAuthStore } from '../../store/authStore';
import { useWedding } from '../../context/WeddingContext';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation<any>(); // ✅ FIX

  const { user, logout } = useAuthStore();
  const { activeWedding } = useWedding();

  const initials =
    user?.name
      ?.split(' ')
      ?.map((n: string) => n[0])
      ?.join('')
      ?.toUpperCase() || 'U';

  return (
    <ScrollView style={styles.container}>
      <Header
        title="Profile"
        subtitle="Manage your account"
        userInitials={initials}
        onLogoutPress={logout} // ✅ now supported
      />

      {/* USER CARD */}
      <View style={styles.card}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.name}>{user?.name || 'User Name'}</Text>
        <Text style={styles.email}>{user?.email || 'No Email'}</Text>
      </View>

      {/* ACTIVE WEDDING */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Active Wedding</Text>

        {activeWedding ? (
          <>
            <Text style={styles.weddingTitle}>{activeWedding.title}</Text>
            <Text style={styles.weddingSub}>ID: {activeWedding.id}</Text>
          </>
        ) : (
          <Text style={styles.emptyText}>No wedding selected</Text>
        )}
      </View>

      {/* SETTINGS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ChangePassword')}
        >
          <Text>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  avatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6D2E46',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  name: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },

  email: {
    textAlign: 'center',
    color: '#777',
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  weddingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  weddingSub: {
    color: '#777',
    marginTop: 4,
  },

  emptyText: {
    color: '#777',
  },

  item: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },

  logoutBtn: {
    marginTop: 10,
    backgroundColor: '#6D2E46',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: '700',
  },
});