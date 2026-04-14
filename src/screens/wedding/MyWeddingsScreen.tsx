import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import API from "../../utils/axios";
import Button from "../../components/Button";
import { showError } from "../../utils/toast";

export default function MyWeddingsScreen({ navigation }: any) {
  const [weddings, setWeddings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWeddings = async () => {
    try {
      const res = await API.get("/weddings/my");
      setWeddings(res?.data?.data || []);
    } catch (err) {
      showError("Failed to load weddings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ❌ Empty State
  if (weddings.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No weddings yet 💍</Text>
        <Text style={styles.emptySubtitle}>
          Start by creating your first wedding
        </Text>

        <Button
          title="Create Wedding"
          onPress={() => navigation.navigate("CreateWedding")}
          style={styles.button}
        />
      </View>
    );
  }

  // ✅ List
  return (
    <View style={styles.container}>
      <FlatList
        data={weddings}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("Events", { weddingId: item.id })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.budget}>
              Budget: ₹{item.totalBudget || 0}
            </Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Add Wedding"
        onPress={() => navigation.navigate("CreateWedding")}
        style={styles.floatingBtn}
      />
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
    padding: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 10,
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
  },

  budget: {
    marginTop: 4,
    color: "#666",
  },

  button: {
    marginTop: 20,
  },

  floatingBtn: {
    marginTop: 10,
  },
});