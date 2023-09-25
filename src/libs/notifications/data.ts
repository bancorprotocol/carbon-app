import { NotificationsMap, NotificationNew } from 'libs/notifications/types';

export interface NotificationSchema {
  generic: NotificationNew;
  reject: undefined;
  revoke: { txHash: string };
  approve: { symbol: string; limited: boolean; txHash: string };
  approveError: { symbol: string };
  trade: { txHash: string; amount: string; from: string; to: string };
  createStrategy: { txHash: string };
  pauseStrategy: { txHash: string };
  renewStrategy: { txHash: string };
  editStrategyName: { txHash: string };
  withdrawStrategy: { txHash: string };
  depositStrategy: { txHash: string };
  deleteStrategy: { txHash: string };
  changeRatesStrategy: { txHash: string };
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
    testid: 'reject',
  }),
  approve: ({ symbol, limited, txHash }) => ({
    status: 'pending',
    title: 'Approving Token ...',
    txHash,
    description: `You are approving ${symbol} for spending on the protocol.`,
    successTitle: 'Success',
    successDesc: `You have successfully approved ${symbol} for ${
      limited ? 'limited' : 'unlimited'
    } spending on the protocol.`,
    failedTitle: 'Transaction Failed',
    failedDesc: `Failed ${symbol} approval for ${
      limited ? 'limited' : 'unlimited'
    }`,
    showAlert: true,
    testid: 'approve',
  }),
  revoke: ({ txHash }) => ({
    status: 'pending',
    title: 'Revoking Past Approval',
    txHash,
    description: `You are revoking previous approval.`,
    successTitle: 'Success',
    successDesc: `Your previous approval was successfully revoked.`,
    failedTitle: 'Transaction Failed',
    failedDesc: `Failed to revoke previous approval.`,
    showAlert: true,
    testid: 'revoke',
  }),
  approveError: ({ symbol }) => ({
    status: 'failed',
    title: 'Approve Token failed',
    description: `Approval for ${symbol} has failed. Please try again or contact support.`,
    showAlert: true,
    testid: 'approve-error',
  }),
  createStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'New strategy is being created.',
    successTitle: 'Success',
    successDesc: 'New strategy was successfully created.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'New strategy creation has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'create-strategy',
  }),
  pauseStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Your request to pause the strategy is being processed.',
    successTitle: 'Success',
    successDesc: 'Your strategy was successfully paused.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Your request to pause your strategy has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'pause-strategy',
  }),
  renewStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Your request to renew the strategy is being processed.',
    successTitle: 'Success',
    successDesc:
      'Your request to renew the strategy was successfully completed.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Your request to renew the strategy has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'renew-strategy',
  }),
  editStrategyName: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Strategy name is being updated.',
    successTitle: 'Success',
    successDesc: 'Strategy name was updated successfully.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Strategy name update has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'edit-strategy-name',
  }),
  withdrawStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Your withdrawal request is being processed.',
    successTitle: 'Success',
    successDesc: 'Your withdrawal request was successfully completed.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Your withdrawal request has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'withdraw-strategy',
  }),
  depositStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Your deposit request is being processed.',
    successTitle: 'Success',
    successDesc: 'Your deposit request was successfully completed.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Your deposit request has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'deposit-strategy',
  }),
  deleteStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Strategy deletion is being processed.',
    successTitle: 'Success',
    successDesc:
      'Strategy was successfully deleted and all associated funds have been withdrawn to your wallet.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Strategy deletion has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'delete-strategy',
  }),
  changeRatesStrategy: (data) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: 'Your edit request is being processed.',
    successTitle: 'Success',
    successDesc: 'Your strategy was successfully updated.',
    failedTitle: 'Transaction Failed',
    failedDesc: 'Your edit request has failed.',
    txHash: data.txHash,
    showAlert: true,
    testid: 'change-rates-strategy',
  }),
  trade: ({ amount, txHash, to, from }) => ({
    status: 'pending',
    title: 'Pending Confirmation',
    description: `Trading ${amount} ${from} for ${to} is being processed.`,
    successTitle: 'Success',
    successDesc: `Trading ${amount} ${from} for ${to} was successfully completed.`,
    failedTitle: 'Transaction Failed',
    failedDesc: `Trading ${amount} ${from} for ${to} has failed.`,
    txHash,
    showAlert: true,
    testid: 'trade',
  }),
};
