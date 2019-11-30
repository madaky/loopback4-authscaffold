import { TokenService } from "@loopback/authentication";
import { inject } from "@loopback/context";
import { TokenServiceBindings } from "../bindings/key";
import { UserProfile, securityId } from "@loopback/security";
import { HttpErrors } from "@loopback/rest";
import * as jwt from "jsonwebtoken";
import { promisify } from "util";

// const signAsync = promisify(jwt.sign); its giving error taking the first overloaded function
const verifyAsync = promisify(jwt.verify);

export class JWTTokenService implements TokenService {

  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET) private jwtTokenSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN) private jwtTokenExpiresIn: string
  ) { }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('Error while verifying token');
    }
    let userProfile: UserProfile;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decryptedToken: any = await verifyAsync(token, this.jwtTokenSecret);

      userProfile = Object.assign(
        { [securityId]: '', name: '' },
        {
          [securityId]: decryptedToken.id,
          name: decryptedToken.name,
          id: decryptedToken.id
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;

  }
  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    const userInfoForToken = {
      id: userProfile[securityId],
      name: userProfile.name,
      email: userProfile.email,
    };
    // Generate a JSON Web Token
    let token: string;

    try {
      token = await new Promise((resolve, reject) => {
        jwt.sign(
          userInfoForToken,
          this.jwtTokenSecret,
          {
            expiresIn: Number(this.jwtTokenExpiresIn),
          },
          function (err, decoded) {
            if (err) reject(err);
            else resolve(decoded);
          });
      }
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }


}
