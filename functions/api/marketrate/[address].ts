import { CFWorkerEnv } from '../../../cfFunctions/types';
import { getPriceByAddress } from '../../../cfFunctions/api/price';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  params: { address },
}) => {
  if (typeof address !== 'string') {
    return new Response('address is not a string', { status: 400 });
  }

  const convert = new URL(request.url).searchParams.get('convert') || 'USD';

  return getPriceByAddress(env, address, convert);
};
