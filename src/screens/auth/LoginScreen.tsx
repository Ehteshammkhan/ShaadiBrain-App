import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";

import API from "../../utils/axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { loginSchema } from "../../utils/validation";
import { useAuthStore } from "../../store/authStore";
import { setToken } from "../../utils/storage";
import { showError, showSuccess } from "../../utils/toast";

export default function LoginScreen({ navigation }: any) {
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      console.log("LOGIN VALUES:", values);

      const res = await API.post("/auth/login", values);

      console.log("LOGIN RESPONSE:", res.data);

      // ✅ Correct mapping from your backend response
      const token = res?.data?.data?.token;
      const user = res?.data?.data?.user;

      if (!token) {
        throw new Error("Token not received");
      }

      // ✅ Save token
      await setToken(token);

      // ✅ Save user in store
      setAuth(user, token);

      // ✅ Toast
      showSuccess(res?.data?.message || "Login successful");

    } catch (err: any) {
      console.log("LOGIN ERROR:", err);

      showError(
        err?.message ||
        err?.data?.message ||
        "Login failed"
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
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>Shadi Brain 💍</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Login to continue planning
        </Text>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              {/* Email */}
              <Input
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email ? errors.email : ""}
                icon={<Text>📧</Text>}
              />

              {/* Password */}
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                error={touched.password ? errors.password : ""}
                icon={<Text>🔒</Text>}
              />

              {/* ✅ Button */}
              <Button
                title="Login"
                onPress={() => handleSubmit()}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ marginTop: 10 }}
              />

              {/* Register Redirect */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.registerText}>
                  Don't have an account?{" "}
                  <Text style={styles.registerLink}>
                    Register
                  </Text>
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F2",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },

  registerText: {
    textAlign: "center",
    marginTop: 16,
    color: "#666",
  },

  registerLink: {
    color: "#C8A97E",
    fontWeight: "600",
  },
});