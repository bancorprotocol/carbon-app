import { Notification, NotificationTx } from 'libs/notifications/types';
import { lsService } from 'services/localeStorage';

// TODO: Remove this migration after July 2024
type OldNotification = Omit<NotificationTx, 'type'>;
const migrateNotification = (
  n: Notification | OldNotification,
): Notification => {
  if (!('type' in n)) return { ...n, type: 'tx' };
  return n;
};

export const getLSUserNotifications = (user?: string): Notification[] => {
  if (!user) return [];
  const notifications = lsService.getItem(`notifications-${user}`) || [];
  return notifications.map(migrateNotification);
};

export const setLSUserNotifications = (
  user: string | undefined,
  data: Notification[],
) => {
  if (!user) return;
  const persisted = data.filter((n) => !n.nonPersistent);
  lsService.setItem(`notifications-${user}`, persisted);
};
