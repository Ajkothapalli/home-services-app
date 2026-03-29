import { User } from '../models/user.model';

export interface LoadUserProfileInput {
  userId: string;
}

/**
 * Loads a user's profile from Firestore by their userId.
 */
export async function loadUserProfile(
  input: LoadUserProfileInput,
): Promise<User> {
  // TODO: Fetch document from Firestore /users/{userId}
  // TODO: Validate document shape against User interface
  throw new Error(`loadUserProfile not implemented for userId: ${input.userId}`);
}
