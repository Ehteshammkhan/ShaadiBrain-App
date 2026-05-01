import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../store/authStore';
import { useWedding } from '../context/WeddingContext';
import API from '../utils/axios';
import Header from '../components/Header';
import { showError } from '../utils/toast';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }: any) {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { setActiveWedding } = useWedding();
  const logout = useAuthStore((s) => s.logout);

  const safeEvents = useMemo(
    () => (Array.isArray(events) ? events : []),
    [events]
  );

  const fetchDashboard = async (weddingId: number) => {
    try {
      const res = await API.get(`/dashboard/${weddingId}`);
      const data = res?.data?.data;

      setEvents(Array.isArray(data?.events) ? data.events : []);
      setSummary(data?.summary || null);
    } catch {
      showError('Failed to load dashboard');
      setEvents([]);
    }
  };

  const fetchWeddings = async () => {
    try {
      setLoading(true);

      const res = await API.get('/wedding/my');
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];

      setWeddings(data);

      if (data.length > 0) {
        const first = data[0];
        setSelectedWedding(first);
        setActiveWedding(first);
        await fetchDashboard(first.id);
      } else {
        setSelectedWedding(null);
        setEvents([]);
      }
    } catch {
      showError('Failed to load weddings');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWeddings();
    }, [])
  );

  const handleWeddingChange = (w: any) => {
    setSelectedWedding(w);
    setActiveWedding(w);
    fetchDashboard(w.id);
  };

  const { totalBudget, totalSpent, remaining, progress } = useMemo(() => {
    if (summary) {
      return {
        totalBudget: summary.totalBudget || 0,
        totalSpent: summary.totalSpent || 0,
        remaining: summary.remaining || 0,
        progress:
          summary.totalBudget > 0
            ? Math.min((summary.totalSpent / summary.totalBudget) * 100, 100)
            : 0,
      };
    }

    let budget = 0;
    let spent = 0;

    safeEvents.forEach((e) => {
      budget += Number(e?.budget || 0);

      const expenses = Array.isArray(e?.Expenses) ? e.Expenses : [];
      expenses.forEach((ex: any) => {
        spent += Number(ex?.amount || 0);
      });
    });

    return {
      totalBudget: budget,
      totalSpent: spent,
      remaining: Math.max(budget - spent, 0),
      progress: budget > 0 ? Math.min((spent / budget) * 100, 100) : 0,
    };
  }, [safeEvents, summary]);

  const recentTasks = useMemo(() => {
    return safeEvents
      .flatMap((e) => (Array.isArray(e?.Tasks) ? e.Tasks : []))
      .slice(0, 5);
  }, [safeEvents]);

  const toggleTask = async (task: any) => {
    try {
      const newStatus =
        task.status === 'completed' ? 'pending' : 'completed';

      await API.patch(`/tasks/status/${task.id}`, {
        status: newStatus,
      });

      if (selectedWedding?.id) {
        fetchDashboard(selectedWedding.id);
      }
    } catch {
      showError('Failed to update task');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <Header
        title="Shadi Brain"
        subtitle="Wedding Planner"
        userInitials="FM"
        onLogoutPress={logout}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && (
          <>
            {/* Wedding Selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {weddings.map((w) => (
                <TouchableOpacity
                  key={w.id}
                  style={[
                    styles.weddingChip,
                    selectedWedding?.id === w.id && styles.activeChip,
                  ]}
                  onPress={() => handleWeddingChange(w)}
                >
                  <Text
                    style={
                      selectedWedding?.id === w.id
                        ? styles.activeChipText
                        : styles.chipText
                    }
                  >
                    {w.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* EVENTS */}
            <Text style={styles.sectionTitle}>Events</Text>

            {safeEvents.length === 0 ? (
              <Text style={{ color: '#777' }}>No events yet</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {safeEvents.map((event) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.eventCard}
                    onPress={() =>
                      navigation.navigate('EventTasks', {
                        eventId: event.id,
                        weddingId: selectedWedding?.id,
                      })
                    }
                  >
                    <Text style={styles.eventTitle}>{event.name}</Text>
                    <Text style={styles.eventBudget}>
                      ₹{event.budget || 0}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={styles.addCard}
                  onPress={() =>
                    navigation.navigate('CreateEvent', {
                      weddingId: selectedWedding?.id,
                    })
                  }
                >
                  <Text style={{ fontSize: 24 }}>＋</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            {/* BUDGET */}
            <View style={styles.budgetCard}>
              <Text style={styles.sectionTitle}>Budget</Text>
              <Text>Total: ₹{totalBudget}</Text>
              <Text>Spent: ₹{totalSpent}</Text>
              <Text>Remaining: ₹{remaining}</Text>

              <View style={styles.progressBar}>
                <View
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#6D2E46',
                  }}
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Tasks</Text>

            {recentTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() =>
                  navigation.navigate('TaskDetails', {
                    taskId: task.id,
                  })
                }
              >
                <View style={styles.taskRow}>
                  <Text>{task.title}</Text>

                  <TouchableOpacity onPress={() => toggleTask(task)}>
                    <Text>
                      {task.status === 'completed' ? '✅' : '⬜'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.taskStatus}>{task.status}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                navigation.navigate('CreateTask', {
                  weddingId: selectedWedding?.id,
                })
              }
            >
              <Text style={styles.actionText}>+ Add Task</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    padding: 16,
    paddingTop: 10,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },

  weddingChip: {
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
  },

  activeChip: {
    backgroundColor: '#6D2E46',
  },

  chipText: { color: '#333' },
  activeChipText: { color: '#fff' },

  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginRight: 10,
    width: 140,
  },

  eventTitle: { fontWeight: '700' },
  eventBudget: { marginTop: 6, color: '#666' },

  addCard: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 14,
  },

  budgetCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    marginTop: 10,
    borderRadius: 6,
  },

  taskCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  taskStatus: {
    color: '#777',
    marginTop: 4,
  },

  actionBtn: {
    marginTop: 12,
    backgroundColor: '#6D2E46',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontWeight: '600',
  },
});