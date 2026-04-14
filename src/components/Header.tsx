import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBellPress?: () => void;
  userInitials?: string;
}

export default function Header({
  title,
  subtitle,
  onBellPress,
  userInitials = "FM",
}: HeaderProps) {
  return (
    <View style={styles.container}>
      {/* Left */}
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {/* Right */}
      <View style={styles.right}>
        <TouchableOpacity onPress={onBellPress}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userInitials}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6D2E46",
  },

  subtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    fontSize: 18,
    marginRight: 12,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6D2E46",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontWeight: "600",
  },
});