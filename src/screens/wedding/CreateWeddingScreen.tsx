import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Formik } from "formik";

import API from "../../utils/axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { showError, showSuccess } from "../../utils/toast";

export default function CreateWeddingScreen({ navigation }: any) {
  const handleCreate = async (values: any, { setSubmitting }: any) => {
    try {
      const payload = {
        title: values.title,
        totalBudget: Number(values.totalBudget) || 0,
      };

      const res = await API.post("/wedding/create", payload);

      showSuccess(res?.data?.message || "Wedding created");

      navigation.goBack();
    } catch (err: any) {
      showError(err?.message || "Failed to create wedding");
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
        <Text style={styles.title}>Create Wedding 💍</Text>

        <Text style={styles.subtitle}>
          Plan your wedding budget smartly
        </Text>

        <Formik
          initialValues={{
            title: "",
            totalBudget: "",
          }}
          onSubmit={handleCreate}
        >
          {({
            handleChange,
            handleSubmit,
            values,
            isSubmitting,
          }) => (
            <>
              {/* Title */}
              <Input
                label="Wedding Title"
                placeholder="e.g. John's Wedding"
                value={values.title}
                onChangeText={handleChange("title")}
              />

              {/* Budget */}
              <Input
                label="Total Budget (₹)"
                placeholder="Enter total budget"
                keyboardType="numeric"
                value={values.totalBudget}
                onChangeText={handleChange("totalBudget")}
              />

              {/* Button */}
              <Button
                title="Create Wedding"
                onPress={handleSubmit as any}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={{ marginTop: 10 }}
              />
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
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    marginTop: 4,
  },
});

CreateWeddingScreen.title = "Create Wedding";