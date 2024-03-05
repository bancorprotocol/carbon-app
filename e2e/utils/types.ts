export const debugTokens = {
  BNB: '0x418D75f65a02b3D53B2418FB8E1fe493759c7605',
  BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
  SHIB: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
  UNI: '0x2730d6FdC86C95a74253BefFaA8306B40feDecbb',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
};

export type StrategyCase =
  | 'create'
  | 'withdraw'
  | 'delete'
  | 'deposit'
  | 'duplicate'
  | 'editPrices'
  | 'pause'
  | 'renew'
  | 'undercut'
  | 'withdraw';
export type DebugTokens = keyof typeof debugTokens;

export type TokenPair = `${DebugTokens}->${DebugTokens}`;

export type Setting = 'limit' | 'range';
export type Direction = 'buy' | 'sell';

export interface MinMax {
  min: string;
  max: string;
}
export interface RangeOrder extends MinMax {
  budget: string;
}

export interface LimitOrder {
  price: string;
  budget: string;
}

export type TestCase<I, O> = {
  input: I;
  output: O;
};
