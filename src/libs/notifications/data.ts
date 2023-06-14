import { NotificationsMap, NotificationNew } from 'libs/notifications/types';
import { i18n } from 'libs/translations';

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
    title: i18n.t('notifications.titles.titles1'),
    description: i18n.t('notifications.descriptions.description1'),
    showAlert: true,
    nonPersistent: true,
  }),
  approve: ({ symbol, limited, txHash }) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles2'),
    txHash,
    description: i18n.t('notifications.descriptions.description2', {
      token: symbol,
    }),
    successTitle: i18n.t('notifications.titles.titles3'),
    successDesc: limited
      ? i18n.t('notifications.descriptions.description3', {
          token: symbol,
        })
      : i18n.t('notifications.descriptions.description4', {
          token: symbol,
        }),
    failedTitle: i18n.t('notifications.titles.titles4'),
    failedDesc: limited
      ? i18n.t('notifications.descriptions.description5', {
          token: symbol,
        })
      : i18n.t('notifications.descriptions.description6', {
          token: symbol,
        }),
    showAlert: true,
  }),
  revoke: ({ txHash }) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles5'),
    txHash,
    description: i18n.t('notifications.descriptions.description7'),
    successTitle: i18n.t('notifications.titles.titles6'),
    successDesc: i18n.t('notifications.descriptions.description8'),
    failedTitle: i18n.t('notifications.titles.titles7'),
    failedDesc: i18n.t('notifications.descriptions.description9'),
    showAlert: true,
  }),
  approveError: ({ symbol }) => ({
    status: 'failed',
    title: i18n.t('notifications.titles.titles8'),
    description: i18n.t('notifications.descriptions.description10', {
      token: symbol,
    }),
    showAlert: true,
  }),
  createStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles9'),
    description: i18n.t('notifications.descriptions.description11'),
    successTitle: i18n.t('notifications.titles.titles10'),
    successDesc: i18n.t('notifications.descriptions.description12'),
    failedTitle: i18n.t('notifications.titles.titles11'),
    failedDesc: i18n.t('notifications.descriptions.description13'),
    txHash: data.txHash,
    showAlert: true,
  }),
  pauseStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles12'),
    description: i18n.t('notifications.descriptions.description14'),
    successTitle: i18n.t('notifications.titles.titles13'),
    successDesc: i18n.t('notifications.descriptions.description15'),
    failedTitle: i18n.t('notifications.titles.titles14'),
    failedDesc: i18n.t('notifications.descriptions.description16'),
    txHash: data.txHash,
    showAlert: true,
  }),
  renewStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles15'),
    description: i18n.t('notifications.descriptions.description17'),
    successTitle: i18n.t('notifications.titles.titles16'),
    successDesc: i18n.t('notifications.descriptions.description18'),
    failedTitle: i18n.t('notifications.titles.titles17'),
    failedDesc: i18n.t('notifications.descriptions.description19'),
    txHash: data.txHash,
    showAlert: true,
  }),
  editStrategyName: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles18'),
    description: i18n.t('notifications.descriptions.description20'),
    successTitle: i18n.t('notifications.titles.titles19'),
    successDesc: i18n.t('notifications.descriptions.description21'),
    failedTitle: i18n.t('notifications.titles.titles20'),
    failedDesc: i18n.t('notifications.descriptions.description22'),
    txHash: data.txHash,
    showAlert: true,
  }),
  withdrawStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles21'),
    description: i18n.t('notifications.descriptions.description23'),
    successTitle: i18n.t('notifications.titles.titles22'),
    successDesc: i18n.t('notifications.descriptions.description24'),
    failedTitle: i18n.t('notifications.titles.titles23'),
    failedDesc: i18n.t('notifications.descriptions.description25'),
    txHash: data.txHash,
    showAlert: true,
  }),
  depositStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles24'),
    description: i18n.t('notifications.descriptions.description26'),
    successTitle: i18n.t('notifications.titles.titles25'),
    successDesc: i18n.t('notifications.descriptions.description27'),
    failedTitle: i18n.t('notifications.titles.titles26'),
    failedDesc: i18n.t('notifications.descriptions.description28'),
    txHash: data.txHash,
    showAlert: true,
  }),
  deleteStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles27'),
    description: i18n.t('notifications.descriptions.description29'),
    successTitle: i18n.t('notifications.titles.titles28'),
    successDesc: i18n.t('notifications.descriptions.description30'),
    failedTitle: i18n.t('notifications.titles.titles29'),
    failedDesc: i18n.t('notifications.descriptions.description31'),
    txHash: data.txHash,
    showAlert: true,
  }),
  changeRatesStrategy: (data) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles30'),
    description: i18n.t('notifications.descriptions.description32'),
    successTitle: i18n.t('notifications.titles.titles31'),
    successDesc: i18n.t('notifications.descriptions.description33'),
    failedTitle: i18n.t('notifications.titles.titles32'),
    failedDesc: i18n.t('notifications.descriptions.description34'),
    txHash: data.txHash,
    showAlert: true,
  }),
  trade: ({ amount, txHash, to, from }) => ({
    status: 'pending',
    title: i18n.t('notifications.titles.titles33'),
    description: i18n.t('notifications.descriptions.description35', {
      amount,
      from,
      to,
    }),
    successTitle: i18n.t('notifications.titles.titles34'),
    successDesc: i18n.t('notifications.descriptions.description36', {
      amount,
      from,
      to,
    }),
    failedTitle: i18n.t('notifications.titles.titles35'),
    failedDesc: i18n.t('notifications.descriptions.description37', {
      amount,
      from,
      to,
    }),
    txHash,
    showAlert: true,
  }),
};
