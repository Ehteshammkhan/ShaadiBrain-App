import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import API from "../../utils/axios";
import { showError, showSuccess } from "../../utils/toast";

export default function TaskDetailsScreen({ route, navigation }: any) {
  const { task: initialTask, taskId, weddingId } = route.params || {};

  const [task, setTask] = useState<any>(initialTask || null);
  const [loading, setLoading] = useState(!initialTask);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [assignedTo, setAssignedTo] = useState<number | null>(null);

  const [members, setMembers] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  // ✅ INIT
  useEffect(() => {
    if (initialTask) {
      initializeState(initialTask);
      setLoading(false);
    } else if (taskId) {
      fetchTask(); // ✅ NEW API
    }

    if (weddingId) {
      fetchMembers();
    }
  }, []);

  // ✅ Initialize state
  const initializeState = (t: any) => {
    if (!t) return;

    setTask(t);
    setTitle(t.title || "");
    setDescription(t.description || "");
    setDeadline(t.deadline ? new Date(t.deadline) : new Date());
    setAssignedTo(t.assignedTo || null);
  };

  // ✅ NEW: Fetch single task
  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${taskId}`);
      const t = res?.data?.data;

      if (!t) throw new Error();

      initializeState(t);
    } catch {
      showError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch members (correct endpoint)
  const fetchMembers = async () => {
    try {
      const res = await API.get(`/wedding/members/${weddingId}`);
      setMembers(res?.data?.data || []);
      console.log("Members:", res?.data?.data);
    } catch {
      showError("Failed to load members");
    }
  };

  // 📅 Date
  const onChangeDate = (_: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) setDeadline(selectedDate);
  };

  // ✏️ Update
  const handleUpdate = async () => {
    if (!title.trim()) return showError("Title is required");

    try {
      setLoading(true);

      await API.put(`/tasks/update/${task.id}`, {
        title,
        description,
        deadline: deadline.toISOString(),
        assignedTo,
      });

      showSuccess("Task updated ✅");

      setTask({
        ...task,
        title,
        description,
        deadline,
        assignedTo,
      });
    } catch (err: any) {
      showError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete
  const confirmDelete = async () => {
    try {
      setLoading(true);

      await API.delete(`/tasks/delete/${task.id}`);

      showSuccess("Task deleted");

      navigation.goBack();
    } catch {
      showError("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: confirmDelete },
    ]);
  };

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Safety
  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Task not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
      />

      {/* Description */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
      />

      {/* Deadline */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text>📅 {deadline.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
        />
      )}

      {/* Members */}
      <Text style={styles.label}>Assign To:</Text>

      <View style={styles.membersWrap}>
        {members.map((m, index) => (
          <TouchableOpacity
            key={m.userId || index}
            style={[
              styles.memberChip,
              assignedTo === m.userId && styles.selectedChip,
            ]}
            onPress={() => setAssignedTo(m.userId)}
          >
            <Text
              style={[
                styles.memberText,
                assignedTo === m.userId && { color: "#fff" },
              ]}
            >
              {m.User?.name || "User"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Update */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Update Task</Text>
      </TouchableOpacity>

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
        <Text style={styles.btnText}>Delete Task</Text>
      </TouchableOpacity>
    </View>
  );
}



// 🎨 Styles
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

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },

  membersWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  memberChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  selectedChip: {
    backgroundColor: "#6D2E46",
  },

  memberText: {
    fontSize: 12,
  },

  primaryBtn: {
    marginTop: 20,
    backgroundColor: "#6D2E46",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteBtn: {
    marginTop: 12,
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
});