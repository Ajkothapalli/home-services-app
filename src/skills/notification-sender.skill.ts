import { NotificationChannel } from '../models/notification.model';

export interface SendNotificationInput {
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string>;
  fcmToken?: string;
  phone?: string;
  email?: string;
}

export interface SendNotificationOutput {
  notificationId: string;
  channel: NotificationChannel;
  sentAt: Date;
  success: boolean;
  error?: string;
}

/**
 * Sends a notification via the specified channel (push, SMS, email, in-app).
 * Routes to FirebaseService, SmsService, or EmailService accordingly.
 */
export async function sendNotification(
  input: SendNotificationInput,
): Promise<SendNotificationOutput> {
  // TODO: Route to appropriate service based on input.channel
  // TODO: For PUSH: call FirebaseService.sendPush with input.fcmToken
  // TODO: For SMS: call SmsService.send with input.phone
  // TODO: Persist to Firestore /notifications/{notificationId}
  throw new Error(`sendNotification not implemented for channel: ${input.channel}`);
}
