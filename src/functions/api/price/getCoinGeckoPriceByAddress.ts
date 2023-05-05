import type { CFWorkerEnv } from 'functions/types';

const baseUrl = 'https://pro-api.coingecko.com/api/v3/simple/';

export const getCoinGeckoPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
) => {
  try {
    const res = await fetch(
      `${baseUrl}token_price/ethereum?contract_addresses=${address}&vs_currencies=${convert}&include_last_updated_at=true`,
      {
        headers: {
          'content-type': 'application/json',
          'x-cg-pro-api-key': env.COINGECKO_API_KEY || '',
        },
      }
    );

    const json = await res.json<any>();
    const firstKey = Object.keys(json)[0];
    if (
      !firstKey ||
      firstKey === 'error' ||
      (json.status?.error_code || 0) > 0 ||
      json[firstKey] === undefined
    ) {
      throw new Error(
        json.status?.error_message || json.error || 'Unknown error'
      );
    }

    const prices: { [k in string]: number } = {};
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
