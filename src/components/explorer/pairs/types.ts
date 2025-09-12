import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';

interface BasePairRow {
  id: string;
  base: Token;
  quote: Token;
  reward?: boolean;
}
export interface RawPairRow extends BasePairRow {
  tradeCount: number;
  tradeCount24h: number;
  strategyAmount: number;
  liquidity: SafeDecimal;
}
export interface PairRow extends BasePairRow {
  tradeCount: string;
  tradeCount24h: string;
  strategyAmount: string;
  liquidity: string;
}
