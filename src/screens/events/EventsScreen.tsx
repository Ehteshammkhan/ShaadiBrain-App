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

export default function EventsScreen({ route, navigation }: any) {
  const { weddingId } = route.params;

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${weddingId}`);
      setEvents(res?.data?.data || []);
    } catch (err) {
      showError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [weddingId])
  );

  // ❌ Delete Event (optional)
  const handleDelete = (event: any) => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/events/delete/${event.id}`);
            showSuccess("Event deleted");
            fetchEvents();
          } catch (err) {
            showError("Delete failed");
          }
        },
      },
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

  // ❌ Empty State
  if (events.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No events yet 🎉</Text>
        <Text style={styles.emptySubtitle}>
          Create your first event for this wedding
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            navigation.navigate("CreateEvent", { weddingId })
          }
        >
          <Text style={styles.primaryBtnText}>+ Add Event</Text>
        </TouchableOpacity>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate("CreateEvent", { weddingId })
          }
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
        data={events}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EventTasks", {
                eventId: item.id,
              })
            }
            onLongPress={() => handleDelete(item)}
          >
            {/* 🔹 Event Name */}
            <Text style={styles.title}>{item.name}</Text>

            {/* 🔹 Budget */}
            <Text style={styles.budget}>
              Budget: ₹{item.budget || 0}
            </Text>

            {/* 🔹 CTA */}
            <View style={styles.footer}>
              <Text style={styles.linkText}>
                View Tasks →
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* 🔥 FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("CreateEvent", { weddingId })
        }
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
    marginBottom: 20,
    textAlign: "center",
  },

  primaryBtn: {
    backgroundColor: "#6D2E46",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
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

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  budget: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },

  footer: {
    marginTop: 12,
  },

  linkText: {
    fontSize: 12,
    color: "#6D2E46",
    fontWeight: "600",
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