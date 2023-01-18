import { Notification } from 'libs/notifications/types';
import { lsService } from 'services/localeStorage';

export const getLSUserNotifications = (user?: string): Notification[] => {
  if (!user) return [];
  return lsService.getItem(`notifications-${user}`) || [];
};

export const setLSUserNotifications = (
  user: string | undefined,
  data: Notification[]
) => {
  if (!user) return;
  const persisted = data.filter((n) => !n.nonPersistent);
  lsService.setItem(`notifications-${user}`, persisted);
};
