import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import API from "../../utils/axios";
import { showError, showSuccess } from "../../utils/toast";

export default function AddMemberScreen({ route, navigation }: any) {
  const { weddingId } = route.params;

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Fetch Users
  const fetchUsers = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setFetchingUsers(true);

      const [usersRes, membersRes] = await Promise.all([
        API.get(`/users/available?weddingId=${weddingId}`),
        API.get(`/members/${weddingId}`),
      ]);

      const allUsers = usersRes?.data?.data || [];
      const members = membersRes?.data?.data || [];

      const memberIds = members.map((m: any) => m.userId);

      // 🔥 Remove already added users
      const filteredUsers = allUsers.filter(
        (u: any) => !memberIds.includes(u.id)
      );

      setUsers(filteredUsers);
    } catch (err: any) {
      showError("Failed to load users");
    } finally {
      setFetchingUsers(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => fetchUsers(true);

  // ➕ Add Member
  const handleAdd = async () => {
    try {
      if (!selectedUser) {
        return showError("Please select a user");
      }

      setLoading(true);

      const res = await API.post("/members/add", {
        weddingId,
        userId: selectedUser.id,
        role,
      });

      showSuccess(res?.data?.message || "Member added");

      navigation.goBack();
    } catch (err: any) {
      showError(
        err?.response?.data?.message || "Failed to add member"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Loading
  if (fetchingUsers) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6D2E46" />
      </View>
    );
  }

  // ❌ Empty state
  if (users.length === 0) {
    return (
      <View style={styles.center}>
        <Text>All users are already added</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Member</Text>

      {/* 👤 User Selection */}
      <Text style={styles.label}>Select User</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => `user-${item.id}`}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => {
          const isSelected = selectedUser?.id === item.id;

          return (
            <TouchableOpacity
              style={[
                styles.userCard,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => setSelectedUser(item)}
            >
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        }}
      />

      {/* 🛡 Role Selection */}
      <Text style={styles.label}>Select Role</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleBtn,
            role === "member" && styles.activeRole,
          ]}
          onPress={() => setRole("member")}
        >
          <Text
            style={[
              styles.roleText,
              role === "member" && styles.activeRoleText,
            ]}
          >
            Member
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleBtn,
            role === "admin" && styles.activeRole,
          ]}
          onPress={() => setRole("admin")}
        >
          <Text
            style={[
              styles.roleText,
              role === "admin" && styles.activeRoleText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* ➕ Submit */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding..." : "Add Member"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F6F2",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  list: {
    maxHeight: 260,
    marginBottom: 10,
  },

  userCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },

  selectedCard: {
    borderColor: "#6D2E46",
    backgroundColor: "#F3E8EC",
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
  },

  email: {
    fontSize: 12,
    color: "#777",
  },

  check: {
    fontSize: 18,
    color: "#6D2E46",
    fontWeight: "bold",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  roleBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },

  activeRole: {
    backgroundColor: "#6D2E46",
    borderColor: "#6D2E46",
  },

  roleText: {
    color: "#333",
    fontWeight: "600",
  },

  activeRoleText: {
    color: "#fff",
  },

  button: {
    backgroundColor: "#6D2E46",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});