export type NetworkDataType = {
  name: string;
  description: string;
  symbol: string;
  base: string;
  display: string;
  denom_units: [
    {
      denom: string;
      exponent: number;
    },
    {
      denom: string;
      exponent: number;
    },
  ];
  images: {
    svg?: string;
    png?: string;
  };
  pointer_contract?: {
    address: string;
    type_asset: string;
  };
  type_asset?: 'erc20' | 'erc721';
};

type DragonSwapToken = {
  chainId: number;
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  tags: string[];
  about: string;
};

export type DragonSwapTokenList = {
  tokens: DragonSwapToken[];
};

export type GitRepoResponse = {
  name: string;
};
