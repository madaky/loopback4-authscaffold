import { UserProfile, securityId } from "@loopback/security";
import { Users } from "../../models";

export function createUserProfile(user: Users): UserProfile {
  const userProfile: UserProfile = { [securityId]: '', name: '' };

  if (user.id) userProfile[securityId] = user.id;

  // let userName = '';
  // if (user.firstName) userName = user.firstName;
  // if (user.lastName)
  //   userName = user.firstName ? `${userName} ${user.lastName}` : user.lastName;
  // userProfile.name = userName;
  userProfile.email = user.email;
  return userProfile;
}
