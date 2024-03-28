import { FC, useId } from 'react';
import { useNotifications } from 'hooks/useNotifications';
import { NotificationActivity } from 'libs/notifications/types';
import { activityActionName, activityDescription } from './utils';
import { ActivityIcon, ActivityId } from './ActivityTable';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { useInterval } from 'hooks/useInterval';
import { FOUR_SECONDS_IN_MS } from 'utils/time';
import { Link } from '@tanstack/react-router';

interface Props {
  notification: NotificationActivity;
  isAlert?: boolean;
}

export const ActivityNotification: FC<Props> = ({ notification, isAlert }) => {
  const titleId = useId();
  const { activity } = notification;
  const { dismissAlert, removeNotification } = useNotifications();

  const handleCloseClick = () => {
    if (isAlert) {
      dismissAlert(notification.id);
    } else {
      removeNotification(notification.id);
    }
  };

  useInterval(
    () => dismissAlert(notification.id),
    isAlert ? FOUR_SECONDS_IN_MS : null,
    false
  );

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      <ActivityId activity={activity} size={16} />
      <Link
        to="/strategy/$id"
        params={{ id: activity.strategy.id }}
        className="flex flex-1 gap-8 overflow-hidden"
        onClick={handleCloseClick}
      >
        <ActivityIcon activity={activity} size={32} />
        <div className="flex-1 overflow-hidden">
          <h3 className="text-14" id={titleId} data-testid="notif-title">
            {activityActionName[activity.action]}
          </h3>
          <p
            className="truncate text-12 text-white/60"
            data-testid="notif-description"
          >
            {activityDescription(activity)}
          </p>
        </div>
      </Link>
      <button
        className="self-start text-12 font-weight-500"
        onClick={handleCloseClick}
        data-testid="notif-close"
      >
        <IconClose className="h-14 w-14 text-white/80" />
      </button>
    </article>
  );
};
