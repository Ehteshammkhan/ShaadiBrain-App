import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Formik } from "formik";

import API from "../../utils/axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { registerSchema } from "../../utils/validation";
import { showError, showSuccess } from "../../utils/toast";

export default function RegisterScreen({ navigation }: any) {
  const handleRegister = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await API.post("/auth/register", values);

      // ✅ success toast
      showSuccess(res?.data?.message || "Registered successfully");

      // ✅ navigate
      navigation.navigate("Login");
    } catch (err: any) {
      // ✅ error toast
      showError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#F8F6F2",
        justifyContent: "center",
        padding: 20,
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 20,
          elevation: 5,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}
      >
        {/* Title */}
        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            color: "#222",
          }}
        >
          Create Account
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#777",
            marginBottom: 20,
            marginTop: 4,
          }}
        >
          Start planning your wedding smartly 💍
        </Text>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleRegister}
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
              {/* Name */}
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={values.name}
                onChangeText={handleChange("name")}
                error={touched.name ? errors.name : ""}
              />

              {/* Email */}
              <Input
                label="Email"
                placeholder="Enter your email"
                value={values.email}
                onChangeText={handleChange("email")}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email ? errors.email : ""}
              />

              {/* Password */}
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={values.password}
                onChangeText={handleChange("password")}
                error={touched.password ? errors.password : ""}
              />

              {/* Button */}
              <Button
                title="Register"
                onPress={handleSubmit as any}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ marginTop: 10 }}
              />

              {/* Redirect */}
              <Text
                onPress={() => navigation.navigate("Login")}
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  color: "#666",
                }}
              >
                Already have an account?{" "}
                <Text
                  style={{
                    color: "#C8A97E",
                    fontWeight: "600",
                  }}
                >
                  Login
                </Text>
              </Text>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}