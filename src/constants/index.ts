import { Platform } from "react-native";

export const COLORS = {
  primary: "#800000", // Deep maroon
  primaryDark: "#5a0000",
  primaryLight: "#9a2a2a",
  secondary: "#C9A227", // Golden
  secondaryDark: "#a07d1f",
  secondaryLight: "#d9b543",
  background: "#FFF5E1", // Warm cream
  white: "#FFFFFF",
  black: "#000000",
  gray: "#666666",
  grayLight: "#E0E0E0",
  grayExtraLight: "#F5F5F5",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
  info: "#007AFF",
};

export const FONTS = {
  regular: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "400" as const,
  },
  medium: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500" as const,
  },
  semiBold: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600" as const,
  },
  bold: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700" as const,
  },
};

export const SIZES = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.black,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
};

export const ICONS = {
  email: "📧",
  password: "🔒",
  user: "👤",
  calendar: "📅",
  budget: "💰",
  task: "✅",
  notification: "🔔",
  wedding: "💍",
  ring: "💍",
  flower: "🌸",
  gift: "🎁",
};

export default {
  COLORS,
  FONTS,
  SIZES,
  SHADOWS,
  STYLES,
  ICONS,
};