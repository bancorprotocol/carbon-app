import type { CFWorkerEnv } from 'functions/types';
import { getCoinGeckoPriceByAddress } from 'functions/api/price/getCoinGeckoPriceByAddress';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
) => {
  const convert = new URL(url).searchParams.get('convert') || 'USD';

  // Add more price sources here
  const promises = [
    { provider: 'coingecko', fn: getCoinGeckoPriceByAddress },
    { provider: 'cmc', fn: getCMCPriceByAddress },
  ];

  let res = { data: {}, provider: '' };
  let error;
  for (const promise of promises) {
    try {
      res.provider = promise.provider;
      res.data = await promise.fn(env, address, convert);
      if (Object.keys(res.data).length) break;
    } catch (ex: any) {
      // TODO handle error and try next price source
      error = ex;
    }
  }

  if (!Object.keys(res.data).length) {
    throw error;
  }

  return res;
};
