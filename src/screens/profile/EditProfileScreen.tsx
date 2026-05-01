import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Formik } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import API from '../../utils/axios';
import { useAuthStore } from '../../store/authStore';
import { showError, showSuccess } from '../../utils/toast';

export default function EditProfileScreen({ navigation }: any) {
  const { user, setAuth, token } = useAuthStore();

  const handleUpdate = async (values: any, { setSubmitting }: any) => {
    try {
      const res = await API.put('/users/update-profile', values); // ✅ FIXED

      const updatedUser = res?.data?.data;

      setAuth(updatedUser, token);

      showSuccess('Profile updated');
      navigation.goBack();
    } catch (err: any) {
      showError(err?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Formik
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
        }}
        onSubmit={handleUpdate}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <>
            <Input
              label="Name"
              value={values.name}
              onChangeText={handleChange('name')}
            />

            <Input
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
            />

            <Button
              title="Save Changes"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
});