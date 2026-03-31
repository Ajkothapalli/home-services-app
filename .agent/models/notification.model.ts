export enum NotificationChannel {
  PUSH = 'push',
  SMS = 'sms',
  EMAIL = 'email',
  IN_APP = 'in_app',
}

export interface Notification {
  notificationId: string;
  userId: string;
  channel: NotificationChannel;
  title: string;
  body: string;
  data?: Record<string, string>;  // deep-link payload
  isRead: boolean;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}
