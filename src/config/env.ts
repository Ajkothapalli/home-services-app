/**
 * Typed environment variable accessors.
 * In React Native, env vars are typically injected via react-native-config
 * or Expo's process.env mechanism.
 */

declare const process: { env: Record<string, string | undefined> };

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const Env = {
  /** Anthropic API key for Claude access. */
  get CLAUDE_API_KEY(): string {
    return requireEnv('CLAUDE_API_KEY');
  },

  /** Google Maps API key for geocoding, directions, and map display. */
  get GOOGLE_MAPS_KEY(): string {
    return requireEnv('GOOGLE_MAPS_KEY');
  },

  /** Firebase project ID for Firestore and FCM. */
  get FIREBASE_PROJECT_ID(): string {
    return requireEnv('FIREBASE_PROJECT_ID');
  },

  /** S3 or GCS bucket name for photo storage. */
  get S3_BUCKET(): string {
    return requireEnv('S3_BUCKET');
  },

  /** Razorpay key ID for payment initiation. */
  get RAZORPAY_KEY_ID(): string {
    return requireEnv('RAZORPAY_KEY_ID');
  },

  /** Optional: MSG91 or Twilio auth token for SMS. */
  get SMS_AUTH_TOKEN(): string | undefined {
    return process.env['SMS_AUTH_TOKEN'];
  },
};
