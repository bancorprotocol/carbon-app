import type { CFWorkerEnv } from 'functions/types';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
) => {
  try {
    const convert = new URL(url).searchParams.get('convert') || 'USD';
    const promises = [getCMCPriceByAddress(env, address, convert)];

    let res;
    for (const promise of promises) {
      res = await promise;
      if (res) break;
    }
    // const res = await getCMCPriceByAddress(env, address, convert);

    return new Response(JSON.stringify(res), {
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'max-age:3600',
      },
    });
  } catch (ex: any) {
    return new Response(ex.message, { status: 500 });
  }
};
