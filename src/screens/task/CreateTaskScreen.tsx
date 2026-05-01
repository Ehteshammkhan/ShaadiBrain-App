import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

import API from "../../utils/axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { showError, showSuccess } from "../../utils/toast";
import { useAuthStore } from "../../store/authStore";

export default function CreateTaskScreen({ route, navigation }: any) {
  const { eventId, weddingId } = route.params;
  const user = useAuthStore(state => state.user);

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState(eventId || null);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // 🔥 Fetch events (for dropdown)
  useEffect(() => {
    fetchEvents();
  }, []);

const fetchEvents = async () => {
  try {
    if (!weddingId) {
      showError("Wedding not found");
      return;
    }

    const res = await API.get(`/events/${weddingId}`);

    console.log("EVENTS RESPONSE:", res.data); // ✅ debug

    setEvents(res?.data?.data || []);
  } catch (err: any) {
    console.log("EVENT FETCH ERROR:", err?.response?.data);
    showError("Failed to load events");
  }
};

  // 📅 Date change
  const onChangeDate = (_: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  // 🔥 Create Task
  const handleCreate = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      if (!values.title?.trim()) {
        return showError("Title is required");
      }

      if (!selectedEvent) {
        return showError("Please select an event");
      }

      const payload = {
        title: values.title,
        description: values.description,
        eventId: selectedEvent,
        assignedTo: user?.id,
        deadline: date.toISOString(),
      };

      const res = await API.post("/tasks/create", payload);

      showSuccess(res?.data?.message || "Task created");

      resetForm();
      navigation.goBack();

    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create task"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Add Task 📝</Text>

          {/* 🔹 Event Dropdown */}
          <Text style={styles.label}>Select Event</Text>
          <View style={styles.chipWrap}>
            {events.map((e) => (
              <TouchableOpacity
                key={e.id}
                style={[
                  styles.chip,
                  selectedEvent === e.id && styles.selectedChip,
                ]}
                onPress={() => setSelectedEvent(e.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedEvent === e.id && { color: "#fff" },
                  ]}
                >
                  {e.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Formik
            initialValues={{
              title: "",
              description: "",
            }}
            onSubmit={handleCreate}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <>
                {/* Title */}
                <Input
                  label="Task Title"
                  placeholder="Enter task title"
                  value={values.title}
                  onChangeText={handleChange("title")}
                />

                {/* Description */}
                <Input
                  label="Description"
                  placeholder="Enter description"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  multiline
                  style={{ height: 80 }}
                />

                {/* Deadline */}
                <Text style={styles.label}>Deadline</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => setShowPicker(true)}
                >
                  <Text>📅 {date.toLocaleDateString()}</Text>
                </TouchableOpacity>

                {showPicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={
                      Platform.OS === "ios" ? "spinner" : "default"
                    }
                    onChange={onChangeDate}
                  />
                )}

                {/* Button */}
                <Button
                  title="Create Task"
                  onPress={handleSubmit as any}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  style={{ marginTop: 16 }}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8F6F2",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  chip: {
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

  chipText: {
    fontSize: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
});