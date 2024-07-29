import KJUR from 'jsrsasign';

import Config from './config';

import DeviceInfo from 'react-native-device-info';

/**
 * AuthService class
 */
class AuthService {
  // Just use the deviceId for the subject claim.
  static getCurrentUsername() {
    return 'hydeparkwinterwonderland-prod@example.com';
    // return DeviceInfo.getUniqueId();
  }

  static authChallenge(options, answerAuthenticationChallenge) {
    // Header
    var oHeader = {alg: 'HS256', typ: 'JWT'};
    // Payload
    var tNow = KJUR.jws.IntDate.get('now');
    var tEnd = KJUR.jws.IntDate.get('now + 1day');
    var oPayload = {
      sub: this.getCurrentUsername(),
      nonce: options.nonce,
      iss: Config.issuer,
      aud: Config.audience,
      iat: tNow,
      exp: tEnd,
    };
    var sHeader = JSON.stringify(oHeader);
    var sPayload = JSON.stringify(oPayload);
    var sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, {
      utf8: Config.secret,
    });

    console.log('JWT: ' + sJWT);
    answerAuthenticationChallenge(sJWT);
  }
}

export default AuthService;
