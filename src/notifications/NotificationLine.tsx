import { motion, Variants } from 'framer-motion';
import { Notification, useNotifications } from './NotificationsProvider';
import { forwardRef } from 'react';

const dropIn: Variants = {
  hidden: {
    y: '100vh',
    opacity: 0,
    scale: 1,
    transition: { type: 'spring' },
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
    scale: 0,
    transition: {
      type: 'spring',
    },
  },
};

export const NotificationLine = forwardRef(
  ({ notification }: { notification: Notification }, ref) => {
    const { removeNotification } = useNotifications();

    return (
      <motion.li
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring' }}
        className={'w-full rounded-2xl bg-red-600 px-4 py-2 text-white'}
      >
        <h3>{notification.title}</h3>
        <p>{notification.description}</p>
        <button onClick={() => removeNotification(notification.id)}>
          close
        </button>
      </motion.li>
    );
  }
);
