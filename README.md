# Introduction
This project is a basic example of how you could approach integrating the [Comapi Javascript SDK - Foundation](https://github.com/comapi/comapi-sdk-js) into a React Native app.

*Note: This project is an example of how to approach using the [Comapi Javascript SDK - Foundation](https://github.com/comapi/comapi-sdk-js) with React native and should be used for example purposes only.*

# Providing a replacement for browser LocalStorage
The JavaScript version of the SDK utilizes the browser LocalStorage facility to persistently store key information between launches of the web container. React native web containers do not offer the LocalStorage facility by default and therefore an alternative must be used.

The file `asyncStorageData.ts` creates a class `AsyncStorageData` that implements the interface for LocalStorage and redirects the storage to use [react-native-async-storage](https://react-native-async-storage.github.io/async-storage/docs/install/).

Now we need to inject this alternative implementation of LocalStorage into the web container running the JavaScript SDK. This is done in the `FoundationService` class as the SDK is initialized. 

Example code for initializing the SDK and injecting the LocalStorage implementation:
```javascript
static initialise() {

    if (this.sdk === undefined) {

      // Create and initialise the interface container
      // This is internally used for dependency injection (IOC)
      var interfaceContainer = new InterfaceContainer();
      interfaceContainer.initialise();

      let comapiConfig = new ComapiConfig()
        .withApiSpace(Config.apiSpaceId)
        // NOTE: authChallenge needs to call internal methods hence the bind
        .withUrlBase(Config.urlBase)
        .withWebSocketBase(Config.webSocketBase)
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
  ```

# Configuring the project
You need to update the `config.ts` file with the following details:

## API Space ID
We need your API Space ID so the SDK knows what data partition to operate with. To find this do the following:
* [For Enterprise Communications API customers](https://docs.cpaas.dotdigital.com/docs/quick-start#your-api-space)
* [For Dotdigital Omnichannel / Push customers](https://developer.dotdigital.com/docs/creating-a-push-notification-profile-new#find-your-api-space-id)

Now update the static variable `apiSpaceId` with this GUID.

## SDK Authentication details
We need SDK authentication details so a JWT can be created to authorize the device and identify the app user:
* [For Enterprise Communications API customers](https://docs.cpaas.dotdigital.com/docs/channel-setup-app-messaging#authentication-setup)
* [For Dotdigital Omnichannel / Push customers](https://developer.dotdigital.com/docs/creating-a-push-notification-profile-new)

Now update the `issuer`, `audience` and `secret` static variables to match the values you looked up.

## Your bundle / package ID
Update the static variable `packageId` with your apps  Android package ID.

Update the static variable `bundleId` with your apps  iOS bundle ID.

## iOS APNS environment
It is important to ensure that a push notification can be sent to an iOS device that we send it to the correct APNS environment. Development builds must use the sandbox APNS environment, whereas all other build types such as ah-hoc, enterprise or app-store require the production APNS environment.

Please ensure the static variable `environment` is set to `Environment.development` for development builds only, and `Environment.production` for all other build types.
