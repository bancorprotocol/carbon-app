import dayjs from 'dayjs';
import { useInterval } from 'hooks/useInterval';
import { useWeb3 } from 'libs/web3/Web3Provider';
import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { uuid } from 'utils/helpers';

export enum NotificationStatus {
  Pending,
  Failed,
  Success,
}

export interface Notification {
  id: string;
  status: NotificationStatus;
  title: string;
  description: string;
  timestamp: number;
  txHash?: string;
  successTitle?: string;
  successDesc?: string;
  failedTitle?: string;
  failedDesc?: string;
}

interface NotificationsContext {
  notifications: Notification[];
  removeNotification: (id: string) => void;
  rejectNotification: () => void;
  createStrategyNtfc: (txHash: string) => void;
  editStrategyNameNtfc: (txHash: string) => void;
  withdrawStrategyNtfc: (txHash: string) => void;
  deleteStrategyNtfc: (txHash: string) => void;
  tradeNtfc: (txHash: string, amount: string, from: string, to: string) => void;
}

const defaultValue: NotificationsContext = {
  notifications: [],
  removeNotification: () => {},
  rejectNotification: () => {},
  createStrategyNtfc: () => {},
  editStrategyNameNtfc: () => {},
  withdrawStrategyNtfc: () => {},
  deleteStrategyNtfc: () => {},
  tradeNtfc: () => {},
};

const NotificationCTX = createContext<NotificationsContext>(defaultValue);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { provider } = useWeb3();

  const dispatchNotification = (
    notification: Omit<Notification, 'id' | 'timestamp'>
  ) => {
    setNotifications((prevState) => [
      ...prevState,
      {
        id: uuid(),
        status: notification.status,
        title: notification.title,
        description: notification.description,
        timestamp: dayjs().unix(),
        txHash: notification.txHash,
      },
    ]);
  };

  const setNotification = (notification: Notification) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id
          ? {
              id: notification.id,
              status: notification.status,
              title: notification.title,
              description: notification.description,
              timestamp: notification.timestamp,
              txHash: notification.txHash,
            }
          : n
      )
    );
  };

  const removeNotification = (id: string) => {
    const newNot = notifications.filter((no) => no.id !== id);
    setNotifications(newNot);
  };

  const checkStatus = async (notification: Notification) => {
    if (!notification.txHash) return;
    try {
      const tx = await provider?.getTransactionReceipt(notification.txHash);
      if (tx)
        setNotification({
          id: notification.id,
          status: tx.status
            ? NotificationStatus.Success
            : NotificationStatus.Failed,
          title: tx.status
            ? notification.successTitle ?? ''
            : notification.failedTitle ?? '',
          description: tx.status
            ? notification?.successDesc ?? ''
            : notification?.failedDesc ?? '',
          timestamp: notification.timestamp,
        });
    } catch (e: any) {}
  };

  useInterval(async () => {
    notifications
      .filter((n) => n.status === NotificationStatus.Pending)
      .forEach((n) => checkStatus(n));
  }, 2000);

  const rejectNotification = () => {
    dispatchNotification({
      status: NotificationStatus.Failed,
      title: 'Transaction Rejected',
      description:
        'You rejected the trade. If this was by mistake, please try again.',
    });
  };

  const createStrategyNtfc = (txHash: string) => {
    dispatchNotification({
      status: NotificationStatus.Pending,
      title: 'Pending Confirmation',
      description: 'New strategy is being created',
      successTitle: 'Success',
      successDesc: 'New strategy was successfully created',
      failedTitle: 'Transaction Failed',
      failedDesc: 'New strategy creation have failed',
      txHash,
    });
  };

  const editStrategyNameNtfc = (txHash: string) => {
    dispatchNotification({
      status: NotificationStatus.Pending,
      title: 'Pending Confirmation',
      description: 'Strategy name is being updated',
      successTitle: 'Success',
      successDesc: 'Strategy name was updated successfully',
      failedTitle: 'Transaction Failed',
      failedDesc: 'Strategy name update have failed',
      txHash,
    });
  };

  const withdrawStrategyNtfc = (txHash: string) => {
    dispatchNotification({
      status: NotificationStatus.Pending,
      title: 'Pending Confirmation',
      description: 'Strategy budget is being withdrawn',
      successTitle: 'Success',
      successDesc: 'Strategy budget was successfully withdrawn',
      failedTitle: 'Transaction Failed',
      failedDesc: 'Strategy budget withdrawal have failed',
      txHash,
    });
  };

  const deleteStrategyNtfc = (txHash: string) => {
    dispatchNotification({
      status: NotificationStatus.Pending,
      title: 'Pending Confirmation',
      description: 'Strategy deletion is being processed',
      successTitle: 'Success',
      successDesc:
        'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet',
      failedTitle: 'Transaction Failed',
      failedDesc: 'Strategy deletion have failed',
      txHash,
    });
  };

  const tradeNtfc = (
    txHash: string,
    amount: string,
    from: string,
    to: string
  ) => {
    dispatchNotification({
      status: NotificationStatus.Pending,
      title: 'Pending Confirmation',
      description: `Trading ${amount} ${from} for ${to} is being processed`,
      successTitle: 'Success',
      successDesc: `Trading ${amount} ${from} for ${to} was successfully completed`,
      failedTitle: 'Transaction Failed',
      failedDesc: `Trading ${amount} ${from} for ${to} have failed`,
      txHash,
    });
  };

  return (
    <NotificationCTX.Provider
      value={{
        notifications,
        removeNotification,
        rejectNotification,
        createStrategyNtfc,
        editStrategyNameNtfc,
        withdrawStrategyNtfc,
        deleteStrategyNtfc,
        tradeNtfc,
      }}
    >
      <>{children}</>
    </NotificationCTX.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationCTX);
};
