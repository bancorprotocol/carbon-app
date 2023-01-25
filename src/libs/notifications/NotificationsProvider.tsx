import { useWeb3 } from 'libs/web3';
import { FC, useEffect } from 'react';
import { NotificationLine } from 'libs/notifications/NotificationLine';
import { AnimatePresence, motion } from 'framer-motion';
import { getLSUserNotifications } from 'libs/notifications/utils';
import { useNotifications } from 'hooks/useNotifications';
import { useInterval } from 'hooks/useInterval';

export const NotificationAlerts: FC = () => {
  const { user } = useWeb3();
  const { alerts, notifications, checkStatus, setNotifications } =
    useNotifications();

  useInterval(async () => {
    notifications
      .filter((n) => n.status === 'pending')
      .forEach((n) => checkStatus(n));
  }, 2000);

  useEffect(() => {
    if (user) {
      const lsNotifications = getLSUserNotifications(user);
      if (lsNotifications) {
        setNotifications(lsNotifications);
      }
    }
  }, [user, setNotifications]);

  return (
    <div className={'fixed absolute top-10 right-10'}>
      <div className={'sticky z-40'}>
        <AnimatePresence mode={'popLayout'}>
          {alerts.map((n) => (
            <motion.div
              key={n.id}
              layout
              variants={notificationVariants}
              whileHover="hover"
              initial="initial"
              animate="animate"
              exit="exit"
              className={
                'mb-20 block w-[350px] rounded-10 bg-silver px-20 py-10'
              }
            >
              <NotificationLine isAlert notification={n} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const notificationVariants = {
  initial: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.2,
    transition: { type: 'spring' },
  },
  hover: { scale: 1.05, transition: { type: 'spring' } },
};
