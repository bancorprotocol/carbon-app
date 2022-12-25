import { FC, useState } from 'react';
import {
  Notification,
  NotificationStatus,
  useNotifications,
} from './NotificationsProvider';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconCarbon } from 'assets/logos/carbon.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'nightjs';

const StatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case NotificationStatus.Pending:
      return (
        <div className="relative flex items-center justify-center">
          <IconCarbon className="text-primary absolute w-5" />
          <div className="absolute h-14 w-14 rounded-full border border-fog" />
          <div className="border-primary h-14 w-14 animate-spin rounded-full border-t border-r" />
        </div>
      );
    case NotificationStatus.Success:
      return <IconCheck className="w-8 text-white" />;
    case NotificationStatus.Failed:
      return <IconTimes className="w-6 text-white" />;
  }
};

export const NotificationLine: FC<{ notification: Notification }> = ({
  notification,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const { removeNotification } = useNotifications();

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mb-10 flex items-center gap-10">
        {StatusIcon(notification.status)}
        <div className="flex w-full items-center justify-between">
          <div>
            {notification.title}
            <div className="text-14">
              {notification.txHash && isHovering ? (
                <a
                  href={getExplorerLink('tx', notification.txHash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Etherscan <IconLink className="ml-6 w-14" />
                </a>
              ) : (
                <div>{notification.description}</div>
              )}
            </div>
          </div>

          <button onClick={() => removeNotification(notification.id)}>
            <IconTimes className="w-8" />
          </button>
        </div>
      </div>

      <div className="text-secondary text-center">
        {unix(notification.timestamp).fromNow(true)}
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
    </div>
  );
};
