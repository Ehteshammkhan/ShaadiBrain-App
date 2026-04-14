import Toast from 'react-native-toast-message';

export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: message,
    position: 'top',
    visibilityTime: 2500,
    autoHide: true,
    topOffset: 0,
  });
};

export const showError = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    position: 'top',
    visibilityTime: 2500,
    autoHide: true,
    topOffset: 0,
  });
};

export const showInfo = (message: string) => {
  Toast.show({
    type: 'info',
    text1: message,
    position: 'top',
    visibilityTime: 2500,
    autoHide: true,
    topOffset: 0,
  });
};