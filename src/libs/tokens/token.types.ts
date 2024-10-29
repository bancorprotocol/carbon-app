export interface Token {
  address: string;
  decimals: number;
  logoURI?: string;
  name?: string;
  symbol: string;
  balance?: string;
  isSuspicious?: boolean;
  chainId?: number;
}

export interface TokenList {
  id: string;
  name: string;
  logoURI?: string;
  tokens: Token[];
}
