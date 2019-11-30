import { AuthenticationStrategy } from '@loopback/authentication';
import { BasicAuthenticationStrategyBindings } from '../bindings/key';
import { BasicAuthenticationUserService } from '../services/basic.auth.user.services';
import { inject } from '@loopback/context';
import { UserProfile } from '@loopback/security';
import { HttpErrors, Request } from '@loopback/rest';

export interface BaiscAuthenticationCredentials {
  email: string;
  password: string;
}

export class BasicAuthenticationstrategy implements AuthenticationStrategy {
  name = 'basic';


  constructor(
    @inject(BasicAuthenticationStrategyBindings.USER_SERVICE)
    private userService: BasicAuthenticationUserService,
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const credentials: BaiscAuthenticationCredentials = this.extractCredentials(request);

    const user = await this.userService.verifyCredentials(credentials);

    const userProfile = this.userService.convertToUserProfile(user);


    return userProfile;

  }
  extractCredentials(request: Request): BaiscAuthenticationCredentials {
    if (!request.headers['XAPIKEY']) {
      console.log(request.headers['XAPIKEY']);
      throw new HttpErrors.Unauthorized(`Authorization header not found sdfdsf.`);
    }
    // for example : Basic Z2l6bW9AZ21haWwuY29tOnBhc3N3b3Jk
    const authHeaderValue: string = request.headers['XAPIKEY'].toString();
    if (!authHeaderValue.startsWith('Basic')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Basic'.`,
      );
    }

    //split the string into 2 parts. We are interested in the base64 portion
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Basic xxyyzz' where xxyyzz is a base64 string.`,
      );
    const encryptedCredentails = parts[1];

    // decrypt the credentials. Should look like :   'username:password'
    const decryptedCredentails = Buffer.from(
      encryptedCredentails,
      'base64',
    ).toString('utf8');

    //split the string into 2 parts
    const decryptedParts = decryptedCredentails.split(':');

    if (decryptedParts.length !== 2) {
      throw new HttpErrors.Unauthorized(
        `Authorization header 'Basic' value does not contain two parts separated by ':'.`,
      );
    }

    const creds: BaiscAuthenticationCredentials = {
      email: decryptedParts[0],
      password: decryptedParts[1],
    };

    return creds;
  }


}
