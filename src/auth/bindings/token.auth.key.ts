import { BindingKey } from "@loopback/core"
import { TokenService } from "@loopback/authentication";

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_KEY = 'GetYourKey'
  export const TOKEN_EXPIRES_IN_LIMIT = '600'
}


export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret'
  );

  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in'
  );

  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'service.authentication.jwt.tokenservice'
  );


}
