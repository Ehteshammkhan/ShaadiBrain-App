import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Button from '../components/Button';
import Header from '../components/Header';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      {/* 🔹 Top Header */}
      <Header
        title="Shadi Brain"
        subtitle="Wedding Planner"
        userInitials="FM"
      />

      {/* 🔹 Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeSmall}>WELCOME BACK</Text>
        <Text style={styles.welcomeTitle}>Namaste, Family! ❤️</Text>
        <Text style={styles.welcomeSub}>
          Add a wedding event to start counting down!
        </Text>

        <View style={styles.actionRow}>
          <Button
            title="+ Add Event"
            onPress={() => navigation.navigate('CreateWedding')}
            style={styles.primaryBtn}
          />

          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryText}>+ New Task</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔹 Budget Overview */}
      <View style={styles.budgetCard}>
        <Text style={styles.budgetTitle}>₹ Budget Overview</Text>

        <View style={styles.budgetRow}>
          <View>
            <Text style={styles.budgetLabel}>Total Budget</Text>
            <Text style={styles.budgetValue}>₹0</Text>
          </View>

          <View>
            <Text style={styles.budgetLabel}>Spent</Text>
            <Text style={[styles.budgetValue, { color: '#C94C4C' }]}>₹0</Text>
          </View>

          <View>
            <Text style={styles.budgetLabel}>Remaining</Text>
            <Text style={[styles.budgetValue, { color: '#2E7D32' }]}>₹0</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.progressText}>0% used</Text>
      </View>

      {/* 🔹 Quick Navigation (TEMP for now) */}
      <View style={styles.section}>
        <Button
          title="Go to Weddings"
          onPress={() => navigation.navigate('MyWeddings')}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    padding: 16,
  },

  /* 🔹 HEADER */
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6D2E46',
  },

  appSubtitle: {
    fontSize: 12,
    color: '#777',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  icon: {
    fontSize: 18,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6D2E46',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontWeight: '600',
  },

  /* 🔹 WELCOME CARD */
  welcomeCard: {
    backgroundColor: '#EAC7C7',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  welcomeSmall: {
    fontSize: 11,
    color: '#6D2E46',
    letterSpacing: 1,
  },

  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
    color: '#3E1F26',
  },

  welcomeSub: {
    fontSize: 13,
    marginTop: 6,
    color: '#5A3E44',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },

  primaryBtn: {
    flex: 1,
  },

  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F3E1E1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#6D2E46',
    fontWeight: '600',
  },

  /* 🔹 BUDGET CARD */
  budgetCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },

  budgetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#6D2E46',
  },

  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  budgetLabel: {
    fontSize: 12,
    color: '#777',
  },

  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
    marginTop: 14,
  },

  progressFill: {
    width: '0%',
    height: '100%',
    backgroundColor: '#6D2E46',
    borderRadius: 6,
  },

  progressText: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
    color: '#777',
  },

  section: {
    marginTop: 20,
  },
});
