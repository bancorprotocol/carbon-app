import { CFWorkerEnv } from './../../types';
import { getCMCPriceByAddress } from './getCMCPriceByAddress';

export const getPriceByAddress = async (request: Request, env: CFWorkerEnv) => {
  const { pathname, searchParams } = new URL(request.url);
  const address = pathname.split('/')[3];
  const convertString = searchParams.get('convert') || 'USD';

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
