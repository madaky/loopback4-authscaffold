import { UserService } from "@loopback/authentication";
import { BaiscAuthenticationCredentials } from "../strategy/basic.auth.strategy";
import { USER_REPO } from "../bindings/key";
import { UsersRepository } from "../../repositories";
import { inject } from "@loopback/context";
import { HttpErrors } from "@loopback/rest";
import { UserProfile } from "@loopback/security";
import { createUserProfile } from "../helper/helper";
import { Users } from "../../models";

export class BasicAuthenticationUserService implements
  UserService<Users, BaiscAuthenticationCredentials>{
  constructor(
    @inject(USER_REPO) private userRepository: UsersRepository,
  ) { }

  async verifyCredentials(
    credentials: BaiscAuthenticationCredentials
  ): Promise<Users> {

    if (!credentials) {
      throw new HttpErrors.Unauthorized(`'credentials' is null`);
    }

    if (!credentials.email) {
      throw new HttpErrors.Unauthorized(`'credentials.email' is null`);
    }

    if (!credentials.password) {
      throw new HttpErrors.Unauthorized(`'credentials.password' is null`);
    }

    const foundUser = await this.userRepository.findOne({ where: { email: credentials.email } });

    if (!foundUser) {
      throw new HttpErrors['Unauthorized'](
        `User with username ${credentials.email} not found.`,
      );
    }

    if (credentials.password !== foundUser.password) {
      throw new HttpErrors.Unauthorized('The password is not correct.');
    }

    return foundUser;

  }

  convertToUserProfile(user: Users): UserProfile {
    if (!user) {
      throw new HttpErrors.Unauthorized(`'user' is null`);
    }

    if (!user.id) {
      throw new HttpErrors.Unauthorized(`'user id' is null`);
    }

    return createUserProfile(user);
  }
}
