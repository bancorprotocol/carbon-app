import type { CFWorkerEnv } from 'functions/types';

const baseUrl = 'https://api.coingecko.com/api/v3/simple/';

export const getCoinGeckoPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
) => {
  const res = await fetch(
    `${baseUrl}token_price/ethereum?contract_addresses=${address}&vs_currencies=${convert}`
  );

  const json = await res.json<{
    [k in string]: {
      [k in string]: number;
    };
  }>();
  const firstKey = Object.keys(json)[0];
  if (!firstKey || firstKey === 'error' || json[firstKey] === undefined) {
    throw new Error(
      (json.error || 'Unknown error') +
        ' | getCoinGeckoPriceByAddress: ' +
        address
    );
  }

  const prices: { [k in string]: { price: number; timestamp: number } } = {};
  Object.keys(json[firstKey]).forEach((c) => {
    prices[c.toUpperCase()] = {
      price: json[firstKey][c],
      timestamp: new Date().getTime(),
    };
  });

  if (Object.keys(prices).length === 0) {
    throw new Error(
      'Internal error: failed to get prices' +
        ' | getCoinGeckoPriceByAddress: ' +
        address
    );
  }

  return prices;
};
