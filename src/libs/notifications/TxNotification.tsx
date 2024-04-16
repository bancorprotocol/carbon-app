import { FC, useId } from 'react';
import { NotificationStatus, NotificationTx } from 'libs/notifications/types';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconTimes } from 'assets/icons/times.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { getExplorerLink } from 'utils/blockExplorer';
import { unix } from 'libs/dayjs';
import { NewTabLink } from 'libs/routing';

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
        <div className="flex h-38 w-38 items-center justify-center rounded-full bg-primary/10">
          <IconCheck className="w-11 text-primary" />
        </div>
      );
    case 'failed':
      return (
        <div className="flex h-38 w-38 items-center justify-center rounded-full bg-error/10">
          <IconTimes className="w-11 text-error" />
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

  return (
    <article aria-labelledby={titleId} className="flex gap-16">
      {StatusIcon(notification.status)}
      <div className="flex flex-1 flex-col gap-8 overflow-hidden text-14">
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
            className="flex items-center font-weight-500"
          >
            View on Etherscan <IconLink className="ml-6 w-14" />
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
          <IconClose className="h-14 w-14 text-white/80" />
        </button>
        <div className="text-secondary whitespace-nowrap text-12 font-weight-500">
          {unix(notification.timestamp).fromNow(true)}
        </div>
      </div>
    </article>
  );
};
