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
  pair?: string;
  strategyId?: string;
}
