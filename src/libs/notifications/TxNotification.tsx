import { FC, useId, useMemo } from 'react';
import { NotificationStatus, NotificationTx } from 'libs/notifications/types';
import IconLink from 'assets/icons/link.svg?react';
import IconTimes from 'assets/icons/times.svg?react';
import IconCheck from 'assets/icons/check.svg?react';
import IconClose from 'assets/icons/X.svg?react';
import { getExplorerLink } from 'utils/blockExplorer';
import { NewTabLink } from 'libs/routing';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import config from 'config';

const StatusIcon = (status: NotificationStatus) => {
  switch (status) {
    case 'pending':
      return (
        <div className="relative flex items-center justify-center">
          <div className="size-38 animate-spin rounded-full border-r border-t border-white" />
        </div>
      );
    case 'success':
      return (
        <div className="size-38 bg-primary/10 flex items-center justify-center rounded-full">
          <IconCheck className="text-primary w-11" />
        </div>
      );
    case 'failed':
      return (
        <div className="size-38 bg-error/10 flex items-center justify-center rounded-full">
          <IconTimes className="text-error w-11" />
        </div>
      );
  }
};

const getTitleByStatus = (n: NotificationTx) => {
  switch (n.status) {
    case 'pending':
      return n.title;
    case 'success':
      return n.successTitle || n.title;
    case 'failed':
      return n.failedTitle || n.title;
  }
};

const getDescriptionByStatus = (n: NotificationTx) => {
  switch (n.status) {
    case 'pending':
      return n.description;
    case 'success':
      return n.successDesc || n.description;
    case 'failed':
      return n.failedDesc || n.description;
  }
};

interface Props {
  notification: NotificationTx;
  close: () => void;
}

export const TxNotification: FC<Props> = ({ notification, close }) => {
  const titleId = useId();
  const blockExplorer = config.network.blockExplorer.name;

  const date = useMemo(
    () => fromUnixTime(notification.timestamp),
    [notification.timestamp],
  );
  const duration = formatDistanceToNow(date, { addSuffix: true });

  return (
    <article
      aria-labelledby={titleId}
      className="grid grid-cols-[auto_1fr] gap-16"
    >
      {StatusIcon(notification.status)}
      <div className="grid">
        <header className="flex items-center justify-between">
          <h3 id={titleId} className="text-16" data-testid="notif-title">
            {getTitleByStatus(notification)}
          </h3>
          <button
            className="text-12 font-medium"
            onClick={close}
            data-testid="notif-close"
            aria-label="Remove notification"
          >
            <IconClose className="size-14 text-main-0/80" />
          </button>
        </header>
        <p
          className="text-14 truncate text-main-0/80"
          data-testid="notif-description"
        >
          {getDescriptionByStatus(notification)}
        </p>
        <footer className="grid grid-flow-col pt-8">
          {notification.txHash && (
            <NewTabLink
              to={getExplorerLink('tx', notification.txHash)}
              className="justify-self-start text-14 font-medium flex items-center"
            >
              View on {blockExplorer}
              <IconLink className="ml-6 w-14" />
            </NewTabLink>
          )}
          <p className="justify-self-end text-12 font-medium whitespace-nowrap text-main-0/60">
            {duration}
          </p>
        </footer>
      </div>
    </article>
  );
};
