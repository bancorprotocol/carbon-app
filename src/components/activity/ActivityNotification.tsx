import { FC, useId } from 'react';
import { NotificationActivity } from 'libs/notifications/types';
import { activityActionName, activityDescription } from './utils';
import { ActivityIcon, ActivityId } from './ActivityTable';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Link } from '@tanstack/react-router';

interface Props {
  notification: NotificationActivity;
  close: () => void;
}

export const ActivityNotification: FC<Props> = ({ notification, close }) => {
  const titleId = useId();
  const { activity } = notification;

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      <ActivityId activity={activity} size={16} />
      <Link
        to="/strategy/$id"
        params={{ id: activity.strategy.id }}
        className="flex flex-1 gap-8 overflow-hidden"
        onClick={close}
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
        onClick={close}
        data-testid="notif-close"
        aria-label="Remove notification"
      >
        <IconClose className="h-14 w-14 text-white/80" />
      </button>
    </article>
  );
};
