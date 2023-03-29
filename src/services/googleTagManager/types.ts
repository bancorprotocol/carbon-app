export type GTMData = {
  event?: string;
  event_properties?: any;
  wallet?: { wallet_id: string; wallet_name: string } | {};
  page?:
    | {
        page_spa_referral: string;
        page_group: Page;
      }
    | {};
};

type Page =
  | 'home'
  | 'firstStrategy'
  | 'newStrategy'
  | 'createNewStrategy'
  | 'trade'
  | 'strategies';

export const routeMapping: { [key: string]: Page } = {
  '/': 'home',
  '/strategies/create': 'createNewStrategy',
  '/trade': 'trade',
};
