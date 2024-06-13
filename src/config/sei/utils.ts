import { isAddress } from 'ethers/lib/utils';
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
  pointer_contract?: {
    address: string;
    type_asset: string;
  };
};

export const tokenListParser =
  (networkId: string) => (data: Record<string, networkDataType[]>) => {
    const networkTokens: Token[] = data[networkId]
      .filter((networkData) => {
        const hasBaseAddress = isAddress(networkData.base);
        const hasPointerAddress =
          !!networkData.pointer_contract?.address &&
          isAddress(networkData.pointer_contract.address);
        return (
          networkData.base !== 'usei' && (hasBaseAddress || hasPointerAddress)
        );
      })
      .map((networkData) => {
        const tokenAddress = isAddress(networkData.base)
          ? networkData.base
          : networkData.pointer_contract!.address;
        return {
          name: networkData.name,
          address: tokenAddress,
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
