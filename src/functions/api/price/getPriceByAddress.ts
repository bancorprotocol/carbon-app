import type { CFWorkerEnv } from 'functions/types';
import { getCMCPriceByAddress } from 'functions/api/price/getCMCPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  url: string,
  address: string
) => {
  try {
    const convert = new URL(url).searchParams.get('convert') || 'USD';
    const res = await getCMCPriceByAddress(env, address, convert);

    return new Response(JSON.stringify(res), {
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (ex: any) {
    return new Response(ex.message, { status: 500 });
  }
};
