import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';

import Input from '../../components/Input';
import Button from '../../components/Button';
import API from '../../utils/axios';
import { showError, showSuccess } from '../../utils/toast';

export default function ChangePasswordScreen() {
  const handleChangePassword = async (values: any, { setSubmitting }: any) => {
    try {
      await API.put('/users/change-password', values); // ✅ FIXED

      showSuccess('Password updated');
    } catch (err: any) {
      showError(err?.message || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
        }}
        onSubmit={handleChangePassword}
      >
        {({ handleChange, handleSubmit, values, isSubmitting }) => (
          <>
            <Input
              label="Old Password"
              secureTextEntry
              value={values.oldPassword}
              onChangeText={handleChange('oldPassword')}
            />

            <Input
              label="New Password"
              secureTextEntry
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
            />

            <Button
              title="Change Password"
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
});