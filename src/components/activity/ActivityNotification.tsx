import { FC, useId } from 'react';
import { NotificationActivity } from 'libs/notifications/types';
import { activityActionName, activityDescription } from './utils';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Link } from '@tanstack/react-router';
import { cn } from 'utils/helpers';
import { ActivityAction } from 'libs/queries/extApi/activity';
import { unix } from 'dayjs';
import style from './ActivityNotification.module.css';

interface Props {
  notification: NotificationActivity;
  close: () => void;
  onClick?: () => void;
}

export const ActivityNotification: FC<Props> = ({
  notification,
  close,
  onClick,
}) => {
  const titleId = useId();
  const { activity } = notification;

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      <AnimatedActionIcon action={activity.action} />
      <div className="text-14 flex flex-1 flex-col gap-8 overflow-hidden">
        <hgroup>
          <h3 className="text-16" id={titleId} data-testid="notif-title">
            {activityActionName[activity.action]}
          </h3>
          <p className="truncate text-white/60" data-testid="notif-description">
            {activityDescription(activity)}
          </p>
        </hgroup>
        <Link
          to="/strategy/$id"
          onClick={onClick}
          params={{ id: activity.strategy.id }}
          className="font-weight-500 flex items-center"
        >
          View Activity
        </Link>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={close}
          data-testid="notif-close"
          aria-label="Remove notification"
        >
          <IconClose className="size-14 text-white/80" />
        </button>

        <p className="text-12 font-weight-500 whitespace-nowrap text-white/60">
          {unix(notification.timestamp).fromNow(true)}
        </p>
      </div>
    </article>
  );
};

export const AnimatedActionIcon = (props: { action: ActivityAction }) => {
  const transform = props.action === 'buy' ? 'rotate(30deg)' : 'rotate(-30deg)';
  return (
    <div
      className={cn(
        'size-38 relative grid place-items-center rounded-full',
        style.icon,
        {
          'bg-buy/20 text-buy': props.action === 'buy',
          'bg-sell/20 text-sell': props.action === 'sell',
        },
      )}
    >
      <svg width="24" height="24" viewBox="0 0 100 100" style={{ transform }}>
        <g>
          <line
            x1="20"
            x2="75"
            y1="50"
            y2="50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="50"
            x2="75"
            y1="25"
            y2="50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line
            x1="50"
            x2="75"
            y1="75"
            y2="50"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
