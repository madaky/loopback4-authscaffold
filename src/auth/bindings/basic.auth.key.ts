import { BindingKey } from "@loopback/core";
import { UsersRepository } from "../../repositories";
import { BasicAuthenticationUserService } from "../services/basic.auth.user.services";


export const USER_REPO = BindingKey.create<UsersRepository>(
  'authentication.user.repo'
);

export namespace BasicAuthenticationStrategyBindings {
  export const USER_SERVICE = BindingKey.create<BasicAuthenticationUserService>(
    'services.authenticate.basic.user.service'
  );
}
