import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, BindingKey } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { BasicAuthenticationstrategy } from './auth/strategy/basic.auth.strategy';
import { BasicAuthenticationStrategyBindings, USER_REPO, TokenServiceBindings, TokenServiceConstants } from './auth/bindings/key';
import { BasicAuthenticationUserService } from './auth/services/basic.auth.user.services';
import { UsersRepository } from './repositories';
import { AuthorizationComponent } from '@loopback/authorization';
import { SECURITY_SCHEME_SPEC } from './auth/utils/security.specs';
import { JWTTokenStrategy } from './auth/strategy/jwttoken.auth.strategy';
import { JWTTokenService } from './auth/services/jwttoken.auth.service';

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');
const pkg: PackageInfo = require('../package.json');

export class AuthscaffoldApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.api({
      openapi: '3.0.0',
      info: { title: pkg.name, version: pkg.version },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }],
    });

    //setuo bindings
    this.setupBindings();
    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);

    registerAuthenticationStrategy(this, BasicAuthenticationstrategy);
    registerAuthenticationStrategy(this, JWTTokenStrategy);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBindings(): void {
    this.bind(USER_REPO).toClass(UsersRepository);
    this.bind(BasicAuthenticationStrategyBindings.USER_SERVICE).toClass(BasicAuthenticationUserService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_KEY);
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_LIMIT);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTTokenService);
  }
}
