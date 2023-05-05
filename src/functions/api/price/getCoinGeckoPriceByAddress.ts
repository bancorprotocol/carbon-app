import type { CFWorkerEnv } from 'functions/types';

const baseUrl = 'https://pro-api.coingecko.com/api/v3/simple/';

export const getCoinGeckoPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
) => {
  try {
    const res = await fetch(
      `${baseUrl}token_price/ethereum?contract_addresses=${address}&vs_currencies=${convert}`,
      {
        headers: {
          'content-type': 'application/json',
          'x-cg-pro-api-key': env.COINGECKO_API_KEY || '',
        },
      }
    );

    const json = await res.json<any>();
    const firstKey = Object.keys(json)[0];
    if (!firstKey || firstKey === 'error' || json[firstKey] === undefined) {
      throw new Error(json.error || 'Unknown error');
    }

    const prices: { [k in string]: { price: number; timestamp: number } } = {};
    Object.keys(json[firstKey]).forEach((c) => {
      prices[c.toUpperCase()] = {
        price: json[firstKey][c],
        timestamp: new Date().getTime(),
      };
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
