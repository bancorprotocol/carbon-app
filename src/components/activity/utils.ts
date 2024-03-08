export interface ActivitySearchParams {
  pair: string;
  strategyId: string;
  action: string;
}

export const activityActionName = {
  create: 'Create',
  editPrice: 'Edit Price',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  buy: 'Buy Low',
  sell: 'Sell High',
  transfer: 'Transfer',
  delete: 'Delete',
  pause: 'Pause',
};
