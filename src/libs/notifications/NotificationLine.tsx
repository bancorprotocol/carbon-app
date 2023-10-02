import { FC, useId } from 'react';
import { Notification, NotificationStatus } from 'libs/notifications/types';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'libs/dayjs';
import { useNotifications } from 'hooks/useNotifications';
import { useInterval } from 'hooks/useInterval';
import { Link } from 'libs/routing';
import { FOUR_SECONDS_IN_MS } from 'utils/time';

const StatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case 'pending':
      return (
        <div className="relative flex items-center justify-center">
          <div className="h-38 w-38 animate-spin rounded-full border-t border-r border-white" />
        </div>
      );
    case 'success':
      return (
        <div className="flex h-38 w-38 items-center justify-center rounded-full bg-green/10">
          <IconCheck className="w-11 text-green" />
        </div>
      );
    case 'failed':
      return (
        <div className="flex h-38 w-38 items-center justify-center rounded-full bg-red/10">
          <IconTimes className="w-11 text-red" />
        </div>
      );
  }
};

const getTitleByStatus = (n: Notification) => {
  switch (n.status) {
    case 'pending':
      return n.title;
    case 'success':
      return n.successTitle || n.title;
    case 'failed':
      return n.failedTitle || n.title;
  }
};

const getDescriptionByStatus = (n: Notification) => {
  switch (n.status) {
    case 'pending':
      return n.description;
    case 'success':
      return n.successDesc || n.description;
    case 'failed':
      return n.failedDesc || n.description;
  }
};

export const NotificationLine: FC<{
  notification: Notification;
  isAlert?: boolean;
}> = ({ notification, isAlert }) => {
  const titleId = useId();
  const { removeNotification, dismissAlert } = useNotifications();

  const handleCloseClick = () => {
    if (isAlert) {
      dismissAlert(notification.id);
    } else {
      removeNotification(notification.id);
    }
  };

  useInterval(
    () => dismissAlert(notification.id),
    isAlert && notification.status !== 'pending' ? FOUR_SECONDS_IN_MS : null,
    false
  );

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      <div className="self-center">{StatusIcon(notification.status)}</div>
      <div className="w-full">
        <h3 id={titleId} data-testid="notif-title">
          {getTitleByStatus(notification)}
        </h3>
        <div className="text-14 text-charcoal/80 dark:text-white/80">
          <p data-testid="notif-description">
            {getDescriptionByStatus(notification)}
          </p>
          {notification.txHash && (
            <Link
              to={getExplorerLink('tx', notification.txHash)}
              className={'mt-10 flex items-center font-weight-500'}
            >
              View on Etherscan <IconLink className="ml-6 w-14" />
            </Link>
          )}
        </div>
      </div>

      <div className={'flex flex-col items-end justify-between'}>
        <div className="text-secondary whitespace-nowrap text-12 font-weight-500">
          {unix(notification.timestamp).fromNow(true)}
        </div>
        <button className="text-12 font-weight-500" onClick={handleCloseClick}>
          {isAlert ? 'Close' : 'Clear'}
        </button>
      </div>
    </article>
  );
};
