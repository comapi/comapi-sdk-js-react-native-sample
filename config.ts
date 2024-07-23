import {
    Environment
  } from "@comapi/sdk-js-foundation";
  

export default class Config {
    
    /**
     * The apiSpaceId you want to associate with your app
     */
    static apiSpaceId = "YOUR API SPACE ID e.g.fa322db0-862e-4cce-b68c-85053cbdcfce";

    /**
     * SDK Authentication
     * 
     * Learn how to find these values in the docs here:
     * Dotdigital Enterprise Communications API: https://docs.cpaas.dotdigital.com/docs/channel-setup-app-messaging
     * Dotdigital Omnichannel and Push API: https://developer.dotdigital.com/docs/creating-a-push-notification-profile-new
     */
    static issuer = "https://api.comapi.com/defaultauth";    
    static audience = "https://api.comapi.com";    
    static secret = "YOUR SECRET";
    
    /**
     * The bundleId / packageId of your app
     */
    static bundleId = "YOUR BUNDLE ID";
    static packageId = "YOUR BUNDLE ID";

    /**
     * Environment for iOS (development/production)
     * Set this to development only for development builds; for ad-hoc, enterprise and app store builds etc.. 
     * please ensure it is set to `Environment.production`
     */
    static environment = Environment.development;

 }
 