import { FC, useState } from 'react';
import {
  Notification,
  NotificationStatus,
  useNotifications,
} from './NotificationsProvider';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'nightjs';

const StatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case NotificationStatus.Pending:
      return (
        <div className="relative flex items-center justify-center">
          <div className="h-38 w-38 animate-spin rounded-full border-t border-r border-white" />
        </div>
      );
    case NotificationStatus.Success:
      return (
        <div className="flex flex h-38 w-38 items-center justify-center rounded-full bg-success-500/10">
          <IconCheck className="w-11 text-success-500" />
        </div>
      );
    case NotificationStatus.Failed:
      return (
        <div className="flex flex h-38 w-38 items-center justify-center rounded-full bg-error-500/10">
          <IconTimes className="w-11 text-error-500" />
        </div>
      );
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
      <div className="flex gap-16">
        <div className="self-center">{StatusIcon(notification.status)}</div>
        <div className="w-full">
          {notification.title}
          <div className="text-14 text-charcoal/80 dark:text-white/80">
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
        {isHovering ? (
          <div
            className="text-12"
            onClick={() => removeNotification(notification.id)}
          >
            Clear
          </div>
        ) : (
          <div className="text-secondary w-full max-w-fit !text-12">
            {unix(notification.timestamp).fromNow(true)}
          </div>
        )}
      </div>
    </div>
  );
};
