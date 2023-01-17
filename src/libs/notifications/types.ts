import { NotificationSchema } from 'libs/notifications/notifications';

export type NotificationStatus = 'pending' | 'failed' | 'success';

export interface Notification {
  id: string;
  status: NotificationStatus;
  title: string;
  description: string;
  timestamp: number;
  txHash?: string;
  successTitle?: string;
  successDesc?: string;
  failedTitle?: string;
  failedDesc?: string;
  showAlert?: boolean;
  nonPersistent?: boolean;
}

export type DispatchNotification = <T extends keyof NotificationSchema>(
  key: T,
  data: NotificationSchema[T]
) => void;

export interface NotificationsContext {
  dispatchNotification: DispatchNotification;
  notifications: Notification[];
  alerts: Notification[];

  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  dismissAlert: (id: string) => void;
}

export type NotificationNew = Omit<Notification, 'id' | 'timestamp'>;

export type NotificationsMap = {
  [key in keyof NotificationSchema]: (
    data: NotificationSchema[key]
  ) => NotificationNew;
};
