import type { CFWorkerEnv } from './../../types';
import { getCMCPriceByAddress } from './getCMCPriceByAddress';

export const getPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convertString: string
) => {
  try {
    const res = await getCMCPriceByAddress(env, address, convertString);

    return new Response(JSON.stringify(res), {
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (ex: any) {
    return new Response(ex.message, { status: 500 });
  }
};
