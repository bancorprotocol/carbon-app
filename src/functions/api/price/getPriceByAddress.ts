import type { CFWorkerEnv } from 'functions/types';
import { getCoinGeckoPriceByAddress } from 'functions/api/price/getCoinGeckoPriceByAddress';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';
import { GetApiPriceResult } from 'functions/types';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
): Promise<GetApiPriceResult> => {
  const convert = new URL(url).searchParams.get('convert') || 'USD';

  // Add more price sources here
  const promises = [];
  if (env.COINGECKO_API_KEY) {
    promises.push({ provider: 'coingecko', fn: getCoinGeckoPriceByAddress });
  }
  if (env.CMC_API_KEY) {
    promises.push({ provider: 'coinmarketcap', fn: getCMCPriceByAddress });
  }

  let res: GetApiPriceResult = { data: {}, provider: '' };
  let error;
  for (const promise of promises) {
    try {
      res.provider = promise.provider;
      res.data = await promise.fn(env, address, convert);
      if (Object.keys(res.data).length) break;
    } catch (ex: any) {
      error = ex;
    }
  }

  if (!Object.keys(res.data).length) {
    throw error;
  }

  return res;
};
