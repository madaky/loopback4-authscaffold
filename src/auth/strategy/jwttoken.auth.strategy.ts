import { AuthenticationStrategy, TokenService } from "@loopback/authentication";
import { inject } from "@loopback/context";
import { TokenServiceBindings } from "../bindings/token.auth.key";
import { Request, HttpErrors } from "@loopback/rest";
import { UserProfile } from "@loopback/security";


export class JWTTokenStrategy implements AuthenticationStrategy {
  name = 'jwtToken';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public tokenService: TokenService
  ) { }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const token: string = this.extractCredential(request);

    const userProfile: UserProfile = await this.tokenService.verifyToken(token);

    return userProfile;
  }

  extractCredential(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header not found');
    }
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    const parts = authHeaderValue.split(' ');

    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );

    const token = parts[1];

    return token;
  }
}
