import { Token } from 'libs/tokens';
import { Dexes } from 'services/uniswap/utils';

export interface MigratedPosition {
  id: string;
  dex: Dexes;
  base: Token;
  quote: Token;
  spread: string;
  buy: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  sell: {
    min: string;
    marginalPrice: string;
    max: string;
    budget: string;
    fee: string;
  };
  fiat: {
    base: {
      budget: string;
      fee: string;
    };
    quote: {
      budget: string;
      fee: string;
    };
    total: {
      budget: string;
      fee: string;
    };
  };
}
