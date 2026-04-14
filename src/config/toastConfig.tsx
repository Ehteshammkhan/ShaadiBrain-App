import React from "react";
import { View } from "react-native";
import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <View style={{ alignItems: "flex-end", width: "100%" }}>
      <BaseToast
        {...props}
        style={{
          borderLeftColor: "#22c55e",
          borderRadius: 10,
          marginRight: 12,
          width: 280,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: "600",
        }}
      />
    </View>
  ),

  error: (props: any) => (
    <View style={{ alignItems: "flex-end", width: "100%" }}>
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: "#ef4444",
          borderRadius: 10,
          marginRight: 12,
          width: 280,
        }}
        text1Style={{
          fontSize: 14,
          fontWeight: "600",
        }}
      />
    </View>
  ),
};