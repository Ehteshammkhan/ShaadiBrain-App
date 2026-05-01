import React, { useState } from "react";
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

const EVENT_TYPES = [
  "Engagement",
  "Mehendi",
  "Sangeet",
  "Wedding",
  "Reception",
];

export default function CreateEventScreen({ route, navigation }: any) {
  const { weddingId } = route.params;

  const [selectedType, setSelectedType] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (_: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleCreate = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const finalName = values.name || selectedType;

      if (!finalName?.trim()) {
        showError("Event name is required");
        return;
      }

      const payload = {
        name: finalName,
        budget: values.budget ? Number(values.budget) : 0,
        weddingId,
      };

      const res = await API.post("/events/create", payload);

      showSuccess(res?.data?.message || "Event created");

      resetForm();
      setSelectedType("");
      navigation.goBack();

    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create event"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Event 🎉</Text>

          {/* 🔹 Quick Select */}
          <Text style={styles.label}>Quick Select</Text>
          <View style={styles.chipWrap}>
            {EVENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  selectedType === type && styles.selectedChip,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedType === type && { color: "#fff" },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Formik
            initialValues={{
              name: "",
              venue: "",
              budget: "",
              description: "",
            }}
            onSubmit={handleCreate}
          >
            {({ handleChange, handleSubmit, values, isSubmitting }) => (
              <>
                <Input
                  label="Event Name"
                  placeholder="Enter event name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                />

                {/* Date */}
                <Text style={styles.label}>Date</Text>
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

                <Input
                  label="Venue"
                  placeholder="Enter venue"
                  value={values.venue}
                  onChangeText={handleChange("venue")}
                />

                <Input
                  label="Total Budget (₹)"
                  placeholder="Enter budget"
                  value={values.budget}
                  onChangeText={handleChange("budget")}
                  keyboardType="numeric"
                />

                <Input
                  label="Description"
                  placeholder="Write something..."
                  value={values.description}
                  onChangeText={handleChange("description")}
                  multiline
                  style={{ height: 80 }}
                />

                <Button
                  title="Create Event"
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
    flex: 1,
    backgroundColor: "#F8F6F2",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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