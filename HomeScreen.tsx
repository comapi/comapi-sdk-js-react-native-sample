import React, { useEffect, useRef, useState, useContext } from 'react';
import { StyleSheet, Text, View, Button, NativeModules } from 'react-native';
import FoundationService from "./foundationService";

import { TokenContext } from './App';

const { DotdigitalModule } = NativeModules;


const HomeScreen = ({ navigation }) => {

  const { token, setToken } = useContext(TokenContext);

  console.log(`token: ${token}`);
  console.log(`setToken: ${setToken}`);


  function callNative() {
    console.log("Calling native method");

    DotdigitalModule.getPlatform(
      (error, result) => {
        console.log(`getPlatform returned ${JSON.stringify(result)}`);
      });

  }

  function startSession() {
    return FoundationService.startSession();
  }

  function endSession() {
    return FoundationService.endSession();
  }

  function setPushDetails() {
    if (token) {
      return FoundationService.setPushDetails(token);
    }
  }

  function removePushDetails() {
    return FoundationService.removePushDetails();
  }

  return (

    <View style={styles.container}>
      <Button
        title="Go to Profile"
        onPress={() =>
          navigation.navigate('Profile', { name: '???' })
        }
      />

      <Text style={styles.welcome}>React Native Push Test</Text>
      <Button onPress={() => callNative()} title="Call Native Method"></Button>
      <Button onPress={() => startSession()} title="Start Session"></Button>
      <Button onPress={() => endSession()} title="End Session"></Button>
      <Button onPress={() => setPushDetails()} title="Set Push Details"></Button>
      <Button onPress={() => removePushDetails()} title="Remove Push Details"></Button>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


export default HomeScreen;