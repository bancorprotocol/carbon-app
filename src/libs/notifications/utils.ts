import { Notification } from 'libs/notifications/types';

export const getLSUserNotifications = (user?: string): Notification[] => {
  if (!user) return [];
  const value = localStorage.getItem(`notifications-${user}`);
  return value ? JSON.parse(value) : [];
};

export const setLSUserNotifications = (
  user: string | undefined,
  data: Notification[]
) => {
  if (!user) return;
  const persisted = data.filter((n) => !n.nonPersistent);
  localStorage.setItem(`notifications-${user}`, JSON.stringify(persisted));
};
