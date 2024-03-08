// export interface Activity {
//   creationWallet: string;
//   currentOwner: string;
//   actionOwner: string;
//   id: string;
//   action: ActivityAction;
//   baseQuote: string;
//   baseSellToken: string;
//   quoteBuyToken: string;
//   buyBudget: number;
//   sellBudget: number;
//   buyBudgetChange: number;
//   sellBudgetChange: number;
//   buyPriceA: number;
//   buyPriceB: number;
//   sellPriceA: number;
//   sellPriceB: number;
//   strategySold: number;
//   tokenSold: string;
//   strategyBought: number;
//   tokenBought: string;
//   avgPrice: number;
//   oldOwner: string | null;
//   newOwner: string | null;
//   date: string;
//   txhash: string;
// }

import { Token } from 'libs/tokens';

type DeepPartial<T> = T extends object
  ? Partial<{ [P in keyof T]: DeepPartial<T[P]> }>
  : T;
interface OrderState {
  min: string;
  max: string;
  budget: string;
}
interface StrategyState<T extends 'server' | 'app'> {
  id: string;
  base: T extends 'server' ? string : Token;
  quote: T extends 'server' ? string : Token;
  owner: string;
  buy: OrderState;
  sell: OrderState;
}
export type ActivityAction =
  | 'create'
  | 'deposit'
  | 'withdraw'
  | 'editPrice'
  | 'delete'
  | 'transfer'
  | 'buy'
  | 'sell'
  | 'pause';
export interface RawActivity<T extends 'server' | 'app'> {
  action: ActivityAction;
  strategy: StrategyState<T>;
  changes: Omit<DeepPartial<StrategyState<T>>, 'base' | 'quote' | 'id'>;
  blockNumber: number;
  txHash: string;
  date: T extends 'server' ? string : Date;
}

export type ServerActivity = RawActivity<'server'>;
export type Activity = RawActivity<'app'>;
