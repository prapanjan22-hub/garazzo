import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

import { store, persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { requestUserPermission, getFCMToken } from './src/utils/notifications';
import { initializeSocket } from './src/utils/socket';

const App = () => {
  useEffect(() => {
    // Hide splash screen
    SplashScreen.hide();

    // Initialize push notifications
    initializePushNotifications();

    // Request notification permissions
    requestUserPermission();

    // Get FCM token
    getFCMToken();

    // Initialize socket connection
    initializeSocket();

    // Handle background messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Handle foreground messages
    });

    return unsubscribe;
  }, []);

  const initializePushNotifications = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function(err) {
        console.error(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff"
            translucent={false}
          />
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
