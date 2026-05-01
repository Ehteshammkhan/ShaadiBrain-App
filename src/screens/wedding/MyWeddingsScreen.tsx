import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import API from "../../utils/axios";
import { showError } from "../../utils/toast";
import Header from "../../components/Header";

export default function MyWeddingsScreen({ navigation }: any) {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Fetch Weddings
  const fetchWeddings = async () => {
    try {
      const res = await API.get("/wedding/my");
      setWeddings(res?.data?.data || []);
    } catch (err) {
      showError("Failed to load weddings");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ REFRESH ON SCREEN FOCUS
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchWeddings();
    }, [])
  );

  // 🔄 Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchWeddings();
  };

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Header ALWAYS */}
      <Header
        title="My Weddings"
        subtitle="Plan your big day!"
        userInitials="FM"
      />

      {/* ❌ Empty */}
      {weddings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>💍</Text>
          <Text style={styles.emptyTitle}>No weddings yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first wedding to start planning
          </Text>
        </View>
      ) : (
        /* ✅ List */
        <FlatList
          data={weddings}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("Events", {
                  weddingId: item.id,
                })
              }
            >
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.budget}>
                ₹ {item.totalBudget || 0}
              </Text>

              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* 🔥 FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateWedding")}
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

  emptyEmoji: {
    fontSize: 50,
    marginBottom: 10,
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
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
    position: "relative",
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  budget: {
    marginTop: 6,
    fontSize: 13,
    color: "#666",
  },

  arrow: {
    position: "absolute",
    right: 16,
    top: 18,
    fontSize: 18,
    color: "#aaa",
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