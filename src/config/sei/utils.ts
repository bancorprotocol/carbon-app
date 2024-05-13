import { Token, TokenList } from 'libs/tokens';

type networkDataType = {
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
    }
  ];
  images: {
    svg?: string;
    png?: string;
  };
};

export const tokenListParser =
  (networkId: string) => (data: Record<string, networkDataType[]>) => {
    const networkTokens: Token[] = data[networkId]
      .filter((networkData) => networkData.base !== 'usei')
      .map((networkData) => {
        return {
          name: networkData.name,
          address: networkData.base,
          symbol: networkData.symbol,
          decimals: networkData.denom_units[1].exponent,
          logoURI:
            networkData.images.svg ?? networkData.images.png ?? undefined,
        };
      });
    const parsedData: TokenList = {
      id: networkId,
      name: 'SEI Network',
      tokens: networkTokens,
    };
    return parsedData;
  };
