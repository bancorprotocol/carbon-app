import type { CFWorkerEnv } from 'functions/types';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';
import { getCoinGeckoPriceByAddress } from 'functions/api/price/getCoinGeckoPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
) => {
  try {
    const convert = new URL(url).searchParams.get('convert') || 'USD';

    // Add more price sources here
    const promises = [getCoinGeckoPriceByAddress, getCMCPriceByAddress];

    let res;
    for (const promise of promises) {
      try {
        res = await promise(env, address, convert);
        if (res) break;
      } catch {
        // TODO handle error and try next price source
      }
    }

    return res;
  } catch (ex: any) {
    return new Response(ex.message, { status: 500 });
  }
};
