import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../utils/axios";
import { showError, showSuccess } from "../../utils/toast";

export default function MyTasksScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks/my");
      setTasks(res?.data?.data || []);
    } catch (err) {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  // 🎨 Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in_progress":
        return "#FF9800";
      default:
        return "#999";
    }
  };

  // 🔁 Status Toggle
  const getNextStatus = (status: string) => {
    if (status === "pending") return "in_progress";
    if (status === "in_progress") return "completed";
    return "pending";
  };

  const handleToggleStatus = async (task: any) => {
    try {
      const newStatus = getNextStatus(task.status);

      await API.patch(`/tasks/status/${task.id}`, {
        status: newStatus,
      });

      showSuccess("Status updated");
      fetchTasks();
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed");
    }
  };

  // ❌ Delete Task
  const handleDelete = (task: any) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/tasks/delete/${task.id}`);
            showSuccess("Task deleted");
            fetchTasks();
          } catch (err: any) {
            showError("Delete failed");
          }
        },
      },
    ]);
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Empty State
  if (tasks.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No tasks yet 📋</Text>
        <Text style={styles.emptySubtitle}>
          Tasks are created inside events.\nGo to Weddings → Events to add tasks.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Weddings")}
        >
          <Text style={styles.primaryBtnText}>Go to Weddings</Text>
        </TouchableOpacity>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("Weddings")}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ List
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("TaskDetails", { task: item })
            }
            onLongPress={() => handleDelete(item)}
          >
            {/* 🔹 Header */}
            <View style={styles.rowBetween}>
              <Text style={styles.title}>{item.title}</Text>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            {/* 🔹 Description */}
            <Text style={styles.desc}>
              {item.description || "No description"}
            </Text>

            {/* 🔹 Footer */}
            <View style={styles.footer}>
              <Text style={styles.deadline}>
                📅 {formatDate(item.deadline)}
              </Text>

              <TouchableOpacity
                onPress={() => handleToggleStatus(item)}
              >
                <Text style={styles.actionText}>Toggle</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Weddings")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F2",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 6,
    textAlign: "center",
  },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: "#6D2E46",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  primaryBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },

  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },

  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  deadline: {
    fontSize: 12,
    color: "#999",
  },

  actionText: {
    fontSize: 12,
    color: "#6D2E46",
    fontWeight: "600",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  fab: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#6D2E46",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  fabText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
  },
});