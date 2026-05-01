import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBellPress?: () => void;
  onLogoutPress?: () => void;
  userInitials?: string;
}

export default function Header({
  title,
  subtitle,
  onBellPress,
  onLogoutPress,
  userInitials = "FM",
}: HeaderProps) {
  const insets = useSafeAreaInsets(); // ✅ safe top spacing

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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

        {onLogoutPress && (
          <TouchableOpacity onPress={onLogoutPress}>
            <Text style={styles.icon}>🚪</Text>
          </TouchableOpacity>
        )}

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

    paddingHorizontal: 16,
    paddingVertical: 16,  
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