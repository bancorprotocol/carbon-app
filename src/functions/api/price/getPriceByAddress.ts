import type { CFWorkerEnv } from 'functions/types';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';
import { getCoinGeckoPriceByAddress } from 'functions/api/price/getCoinGeckoPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
) => {
  const convert = new URL(url).searchParams.get('convert') || 'USD';

  // Add more price sources here
  const promises = [getCMCPriceByAddress, getCoinGeckoPriceByAddress];

  let res;
  for (const promise of promises) {
    try {
      res = await promise(env, address, convert);
      if (res) break;
    } catch (ex: any) {
      // TODO handle error and try next price source
      throw new Response(ex.message, { status: 500 });
    }
  }

  return res;
};
