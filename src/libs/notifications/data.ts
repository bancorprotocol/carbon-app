import { NotificationsMap, NotificationNew } from 'libs/notifications/types';

export interface NotificationSchema {
  generic: NotificationNew;
  reject: undefined;
  approve: { symbol: string; limited: boolean; txHash: string };
  trade: { txHash: string; amount: string; from: string; to: string };
  createStrategy: { txHash: string };
  pauseStrategy: { txHash: string };
  editStrategyName: { txHash: string };
  withdrawStrategy: { txHash: string };
  deleteStrategy: { txHash: string };
}

export const NOTIFICATIONS_MAP: NotificationsMap = {
  generic: (data) => data,
  reject: () => ({
    status: 'failed',
    title: 'Transaction Rejected',
    description:
      'You rejected the transaction. If this was by mistake, please try again.',
    showAlert: true,
    nonPersistent: true,
  }),
  approve: ({ symbol, limited, txHash }) => ({
    status: 'pending',
    title: 'Approving Token ...',
    txHash,
    description: `You are approving ${symbol} for spending on the protocol.`,
    successTitle: 'Token Approved',
    successDesc: `You have successfully approved ${symbol} for ${
      limited ? 'limited' : 'unlimited'
    } spending on the protocol.`,
    failedTitle: 'Token Approval Failed',
    failedDesc: `Failed ${symbol} approval for ${
      limited ? 'limited' : 'unlimited'
    } spending on the protocol.`,
    showAlert: true,
  }),
  createStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'New strategy is being created',
    successTitle: 'Success',
    successDesc: 'New strategy was successfully created',
    failedTitle: 'Transaction Failed',
    failedDesc: 'New strategy creation has failed',
    txHash: data.txHash,
    showAlert: true,
  }),
  pauseStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Taking the strategy off curve is being processed',
    successTitle: 'Success',
    successDesc: 'The strategy was successfully taken off curve',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Taking the strategy off curve have failed',
    txHash: data.txHash,
    showAlert: true,
  }),
  editStrategyName: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Strategy name is being updated',
    successTitle: 'Success',
    successDesc: 'Strategy name was updated successfully',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Strategy name update have failed',
    txHash: data.txHash,
    showAlert: true,
  }),
  withdrawStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Strategy budget is being withdrawn',
    successTitle: 'Success',
    successDesc: 'Strategy budget was successfully withdrawn',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Strategy budget withdrawal have failed',
    txHash: data.txHash,
    showAlert: true,
  }),
  deleteStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Strategy deletion is being processed',
    successTitle: 'Success',
    successDesc:
      'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Strategy deletion have failed',
    txHash: data.txHash,
    showAlert: true,
  }),
  trade: ({ amount, txHash, to, from }) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: `Trading ${amount} ${from} for ${to} is being processed`,
    successTitle: 'Success',
    successDesc: `Trading ${amount} ${from} for ${to} was successfully completed`,
    failedTitle: 'Transaction Failed',
    failedDesc: `Trading ${amount} ${from} for ${to} have failed`,
    txHash,
    showAlert: true,
  }),
};
