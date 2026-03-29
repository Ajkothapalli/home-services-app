// TODO: import messaging from '@react-native-firebase/messaging';
// TODO: import firestore from '@react-native-firebase/firestore';

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Requests FCM notification permission and returns the device token.
 */
export async function requestPermissionAndGetToken(): Promise<string> {
  // TODO: const authStatus = await messaging().requestPermission();
  // TODO: const token = await messaging().getToken();
  throw new Error('requestPermissionAndGetToken: @react-native-firebase/messaging not installed');
}

/**
 * Sends a push notification to a specific FCM device token via the Admin SDK or Cloud Function.
 */
export async function sendPush(fcmToken: string, payload: PushPayload): Promise<void> {
  // TODO: Call Firebase Admin SDK (via Cloud Function) to send FCM message
  // TODO: POST to your /sendNotification Cloud Function endpoint
  throw new Error(`sendPush not implemented for token: ${fcmToken.slice(0, 10)}...`);
}

/**
 * Subscribes the current device to a Firestore real-time listener on a document.
 * Returns an unsubscribe function.
 */
export function subscribeToDocument(
  collectionPath: string,
  documentId: string,
  onData: (data: Record<string, unknown>) => void,
  onError: (error: Error) => void,
): () => void {
  // TODO: return firestore().collection(collectionPath).doc(documentId).onSnapshot(...)
  return () => {};
}
