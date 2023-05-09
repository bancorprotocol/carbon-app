import type { CFWorkerEnv, CurrencyDict } from 'functions/types';
import { config } from 'services/web3/config';

const baseUrl = 'https://pro-api.coingecko.com/api/v3/simple/';

export const getCoinGeckoPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
): Promise<CurrencyDict> => {
  const init = {
    headers: {
      'content-type': 'application/json',
      'x-cg-pro-api-key': env.COINGECKO_API_KEY,
    },
  };
  try {
    let res: Response;
    if (address.toLowerCase() === config.tokens.ETH.toLowerCase()) {
      res = await fetch(
        `${baseUrl}price?id=ethereum&vs_currencies=${convert}`,
        init
      );
    } else {
      res = await fetch(
        `${baseUrl}token_price/ethereum?contract_addresses=${address}&vs_currencies=${convert}`,
        init
      );
    }

    const json = await res.json<any>();
    const firstKey = Object.keys(json)[0];
    if (
      !firstKey ||
      firstKey === 'error' ||
      (json.status?.error_code || 0) > 0 ||
      json[firstKey] === undefined
    ) {
      throw new Error(
        json.status?.error_message ||
          json.error ||
          'Internal error: failed to get prices'
      );
    }

    const prices: CurrencyDict = {};
    Object.keys(json[firstKey]).forEach((c) => {
      prices[c.toUpperCase()] = json[firstKey][c];
    });

    if (Object.keys(prices).length === 0) {
      throw new Error('Internal error: failed to get prices');
    }

    return prices;
  } catch (error: any) {
    throw new Error(
      (error.message || 'Internal error: failed to get prices') +
        ' | getCoinGeckoPriceByAddress: ' +
        address
    );
  }
};
