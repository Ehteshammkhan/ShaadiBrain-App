import 'react-native-gesture-handler';
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

import API from '../../utils/axios';
import { showError, showSuccess } from '../../utils/toast';

// 🔹 Status Config
const STATUS_CONFIG: any = {
  completed: { color: '#4CAF50', label: 'Completed', next: 'pending' },
  in_progress: { color: '#FF9800', label: 'In Progress', next: 'completed' },
  pending: { color: '#9E9E9E', label: 'Pending', next: 'in_progress' },
};

// 🔹 Priority Config
const PRIORITY_CONFIG: any = {
  high: { color: '#E53935', label: 'High' },
  medium: { color: '#FB8C00', label: 'Medium' },
  low: { color: '#43A047', label: 'Low' },
};

// 🔹 Task Item
const TaskItem = React.memo(
  ({
    item,
    navigation,
    onStatusToggle,
    onDelete,
    updatingId,
    getStatusColor,
    getPriorityColor,
  }: any) => {
    const swipeableRef = useRef<any>(null);

    const handlePress = useCallback(() => {
      navigation.navigate('TaskDetails', { task: item });
    }, [item, navigation]);

    const renderRightActions = useCallback(
      () => (
        <TouchableOpacity
          style={styles.deleteBox}
          onPress={() => onDelete(item)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      ),
      [item, onDelete],
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        overshootRight={false}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={handlePress}
          onLongPress={() => {
            Alert.alert('Actions', 'Choose action', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Mark Next Status',
                onPress: () => onStatusToggle(item),
              },
              {
                text: 'Delete',
                onPress: () => onDelete(item),
                style: 'destructive',
              },
            ]);
          }}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.title}>{item.title}</Text>

            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.badgeText}>
                {STATUS_CONFIG[item.status]?.label || item.status}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.priority,
              { color: getPriorityColor(item.priority || 'low') },
            ]}
          >
            Priority: {PRIORITY_CONFIG[item.priority]?.label || 'Low'}
          </Text>

          {item.description ? (
            <Text style={styles.desc}>{item.description}</Text>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.deadline}>
              📅{' '}
              {item.deadline
                ? new Date(item.deadline).toLocaleDateString()
                : 'No date'}
            </Text>

            {updatingId === item.id && <ActivityIndicator size="small" />}
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  },
);

// 🔹 Main Screen
export default function EventTasksScreen({ route, navigation }: any) {
  const { eventId, weddingId } = route.params;

  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = useCallback(
    (status: string) => STATUS_CONFIG[status]?.color || '#9E9E9E',
    [],
  );

  const getPriorityColor = useCallback(
    (priority: string) => PRIORITY_CONFIG[priority]?.color || '#43A047',
    [],
  );

  const getNextStatus = useCallback(
    (status: string) => STATUS_CONFIG[status]?.next || 'pending',
    [],
  );

  // 🔹 Fetch Tasks
  const fetchTasks = useCallback(
    async (isRefreshing = false) => {
      try {
        isRefreshing ? setRefreshing(true) : setLoading(true);
        setError(null);

        const res = await API.get(`/tasks/event/${eventId}`);
        setTasks(res?.data?.data || []);
      } catch (err: any) {
        const msg = err?.response?.data?.message || 'Failed to load tasks';
        setError(msg);
        showError(msg);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [eventId],
  );

  const onRefresh = useCallback(() => {
    fetchTasks(true);
  }, [fetchTasks]);

  // ✅ FIXED REFRESH LOGIC
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  // 🔹 Toggle Status
  const handleStatusToggle = useCallback(
    async (task: any) => {
      const newStatus = getNextStatus(task.status);
      const previous = tasks;

      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status: newStatus } : t)),
      );

      setUpdatingId(task.id);

      try {
        await API.patch(`/tasks/status/${task.id}`, {
          status: newStatus,
        });
        showSuccess('Status updated');
      } catch {
        setTasks(previous);
        showError('Failed to update');
      } finally {
        setUpdatingId(null);
      }
    },
    [tasks, getNextStatus],
  );

  // 🔹 Delete Task
  const handleDelete = useCallback(
    (task: any) => {
      Alert.alert('Delete Task', `Delete "${task.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const previous = tasks;

            setTasks(prev => prev.filter(t => t.id !== task.id));

            try {
              await API.delete(`/tasks/delete/${task.id}`);
              showSuccess('Deleted');
            } catch {
              setTasks(previous);
              showError('Delete failed');
            }
          },
        },
      ]);
    },
    [tasks],
  );

  const navigateToCreateTask = useCallback(() => {
    navigation.navigate('CreateTask', {
      eventId,
      weddingId, 
    });
  }, [navigation, eventId, weddingId]);

  const keyExtractor = (item: any) => `task-${item.id}`;

  // 🔹 UI STATES
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6D2E46" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No tasks yet</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={navigateToCreateTask}
        >
          <Text style={styles.primaryBtnText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            navigation={navigation}
            onStatusToggle={handleStatusToggle}
            onDelete={handleDelete}
            updatingId={updatingId}
            getStatusColor={getStatusColor}
            getPriorityColor={getPriorityColor}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={navigateToCreateTask}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6F2',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  desc: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deadline: {
    fontSize: 12,
    color: '#999',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
  },
  deleteBox: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
  },
  deleteText: {
    color: '#fff',
  },
  priority: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6D2E46',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
  },
  primaryBtn: {
    marginTop: 20,
    backgroundColor: '#6D2E46',
    padding: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: '#fff',
  },
  errorText: {
    color: 'red',
  },
});
