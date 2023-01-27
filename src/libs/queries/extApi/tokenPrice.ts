import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import axios from 'axios';
import { config } from 'services/web3/config';

export type TokenPrice = {
  usd: string;
};

type ReturnType = {
  [p: string]: TokenPrice;
};

export const useGetTokenPrice = (address?: string) => {
  return useQuery(
    QueryKey.tokenPrice(address!),
    async () => {
      if (address?.toLowerCase() === config.tokens.ETH.toLowerCase()) {
        const result = await axios.get<[{ current_price: number }]>(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum`
        );
        if (result.data.length !== 1) {
          throw new Error('No ETH price found on coingecko');
        }
        return { usd: result.data[0].current_price };
      }

      const result = await axios.get<ReturnType>(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
      );
      return result.data[address!.toLowerCase()];
    },
    {
      enabled: !!address,
      refetchInterval: 10 * 1000,
    }
  );
};
