import { NotificationSchema } from 'libs/notifications/data';
import { Activity } from 'libs/queries/extApi/activity';

export type NotificationStatus = 'pending' | 'failed' | 'success';

interface BaseNotification {
  id: string;
  timestamp: number;
  testid: string;
  showAlert?: boolean;
  nonPersistent?: boolean;
}

export interface NotificationTx extends BaseNotification {
  type: 'tx';
  status: NotificationStatus;
  title: string;
  description: string;
  txHash?: string;
  successTitle?: string;
  successDesc?: string;
  failedTitle?: string;
  failedDesc?: string;
}

export interface NotificationActivity extends BaseNotification {
  type: 'activity';
  activity: Activity;
}

export type Notification = NotificationTx | NotificationActivity;

export type DispatchNotification = <T extends keyof NotificationSchema>(
  key: T,
  data: NotificationSchema[T],
) => void;

export interface NotificationsContext {
  dispatchNotification: DispatchNotification;
  notifications: Notification[];
  alerts: Notification[];

  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  dismissAlert: (id: string) => void;
  hasPendingTx: boolean;
}

export type NotificationsMap = {
  [key in keyof NotificationSchema]: (
    data: NotificationSchema[key],
  ) =>
    | Omit<NotificationTx, 'id' | 'timestamp'>
    | Omit<NotificationActivity, 'id' | 'timestamp'>;
};
