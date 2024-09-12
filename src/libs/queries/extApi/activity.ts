import { Token } from 'libs/tokens';

interface OrderState {
  min: string;
  max: string;
  budget: string;
}
interface StrategyChanges {
  owner?: string;
  buy?: Partial<OrderState>;
  sell?: Partial<OrderState>;
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
  | 'edit'
  | 'delete'
  | 'transfer'
  | 'buy'
  | 'sell'
  | 'pause';
export interface RawActivity<T extends 'server' | 'app'> {
  action: ActivityAction;
  strategy: StrategyState<T>;
  changes?: StrategyChanges;
  blockNumber: number;
  txHash: string;
  timestamp: number;
  date: T extends 'server' ? undefined : Date;
}

export type ServerActivity = RawActivity<'server'>;
export type Activity = RawActivity<'app'>;

export interface QueryActivityParams {
  ownerId?: string;
  token0?: string;
  token1?: string;
  strategyIds?: string;
  pairs?: string;
  actions?: string;
  limit?: number;
  offset?: number;
  start?: string | number;
  end?: string | number;
}

interface RawActivityMeta<T extends string | Token> {
  size: number;
  actions: ActivityAction[];
  strategies: Record<string, [T, T]>;
  pairs: [T, T][];
}
export type ServerActivityMeta = RawActivityMeta<string>;
export type ActivityMeta = RawActivityMeta<Token>;
