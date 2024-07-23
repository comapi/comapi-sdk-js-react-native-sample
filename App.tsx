import React, { useEffect, useState, useContext, createContext } from 'react';
import { StyleSheet, Text, View, Button, NativeModules } from 'react-native';
import FoundationService from "./foundationService"

import { Notifications } from 'react-native-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

export const TokenContext = createContext<any>({})

export default function App() {

  const [token, setToken] = useState({})
  const value = {
    token,
    setToken,
  }


  function initialiseComapi(deviceToken: any) {
    setToken(deviceToken);

    console.log("Inintialising COMAPI ...")
    // initialise sdk
    FoundationService.initialise()
      .then(() => {
        // Start a session 
        return FoundationService.startSession();
      })
      .then(() => {
        // register the device token 
        return FoundationService.setPushDetails(deviceToken);
      });

  }

  function initialisePush() {
    // I'm using this to aquire a device token - there are several alternative packages available.
    // We request a device token on startup and pass it to DotDigital. Both these taskas are asynchronous (including initialising the sdk)
    // I have chained these together so as to avoid any race conditions.
    Notifications.registerRemoteNotifications();

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      initialiseComapi(event.deviceToken, setToken);
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event);
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log("Notification Received - Foreground", notification.payload);

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false });
    });

    Notifications.events().registerNotificationOpened((notification, completion, action) => {
      console.log("Notification opened by device user", notification.payload);
      console.log(`Notification opened with an action identifier: ${action.identifier} and response text: ${action.text}`);
      completion();
    });

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log("Notification Received - Background", notification.payload);

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: false });
    });

  }


  useEffect(() => {
    initialisePush();
  }, []);

  return (
    <TokenContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Push Test' }}
          />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TokenContext.Provider>
  );
}

