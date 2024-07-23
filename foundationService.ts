import { Platform } from 'react-native';

import {
  Foundation,
  ComapiConfig,
  InterfaceContainer,
  Environment
} from "@comapi/sdk-js-foundation";

import AuthService from "./authService";
import Config from "./config";
import AsyncStorageData from "./asyncStorageData"

// https://stackoverflow.com/questions/42829838/react-native-atob-btoa-not-working-without-remote-js-debugging
import {decode, encode} from 'base-64';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}


class FoundationService {
  static sdk: Foundation;


  static initialise() {

    if (this.sdk === undefined) {

      // Create and initialize the interface container
      // This is internally used for dependency injection (IOC)
      var interfaceContainer = new InterfaceContainer();
      interfaceContainer.initialise();

      let comapiConfig = new ComapiConfig()
        .withApiSpace(Config.apiSpaceId)
        // NOTE: authChallenge needs to call internal methods hence the bind
        .withAuthChallenge(AuthService.authChallenge.bind(AuthService))
        .withLogLevel(3);

      // Mechanism to enable this container to be used whilst bootstrapping library 
      comapiConfig.interfaceContainer = interfaceContainer;
      interfaceContainer.bindComapiConfig(comapiConfig);

      // Create instance of alternative LocalStorageData service and put it in the container
      let asyncStorageData = new AsyncStorageData();
      interfaceContainer.setInterface("LocalStorageData", asyncStorageData);

      // Initialise as normal
      return Foundation.initialise(comapiConfig)
        .then(sdk => {
          this.sdk = sdk;
          console.log("foundation interface created");
          return sdk;
        })
        .catch(error => {
          console.error("initialise failed", error);
          throw error;
        });
    } else {
      return Promise.resolve(this.sdk);
    }

  }


  /**
   * Starts a session
   */
  static startSession() {
    return this.sdk.startSession();
  }

  /**
   * Ends the session
   */
  static endSession() {
    return this.sdk.endSession();
  }

  /**
   * Sets the native push tokens for the device
   * @param token 
   */
  static setPushDetails(token) {

    if (Platform.OS === 'ios') {
      console.log('I am an iOS device!');

      return this.sdk.device.setAPNSPushDetails(Config.bundleId, Config.environment, token)
        .then(result => {
          console.log("APNS registration succeeded", result);
          return result;
        })
        .catch(error => {
          console.error("APNS registration failed", error);
        });

    } else if (Platform.OS === 'android') {
      console.log('I am an Android device!');

      return this.sdk.device.setFCMPushDetails(Config.packageId, token)
        .then(result => {
          console.log("FCM registration succeeded", result);
          return result;
        })
        .catch(error => {
          console.error("FCM registration failed", error);
        });
    }
  }

  /**
   * Remove push tokens to prevent push notifications
   */
  static removePushDetails() {
    return this.sdk.device.removePushDetails();
  }

  /**
   * Returns the SDKs user profile details
   * @returns The SDKs user profile details
   */
  static getProfile(){
    return this.sdk.services.profile.getMyProfile();
  }

}


export default FoundationService;