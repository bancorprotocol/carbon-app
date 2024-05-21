import { FC, useId } from 'react';
import { NotificationStatus, NotificationTx } from 'libs/notifications/types';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'libs/dayjs';
import { NewTabLink } from 'libs/routing';
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

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      {StatusIcon(notification.status)}
      <div className="text-14 flex flex-1 flex-col gap-8 overflow-hidden">
        <hgroup>
          <h3 id={titleId} className="text-16" data-testid="notif-title">
            {getTitleByStatus(notification)}
          </h3>
          <p className="truncate text-white/80" data-testid="notif-description">
            {getDescriptionByStatus(notification)}
          </p>
        </hgroup>
        {notification.txHash && (
          <NewTabLink
            to={getExplorerLink('tx', notification.txHash)}
            className="font-weight-500 flex items-center"
          >
            View on {blockExplorer}
            <IconLink className="ml-6 w-14" />
          </NewTabLink>
        )}
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          className="text-12 font-weight-500"
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
