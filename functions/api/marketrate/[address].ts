import { CFWorkerEnv } from '../../../cfFunctions/types';
import { getPriceByAddress } from '../../../cfFunctions/api/price';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request: { url },
  env,
  params: { address },
}) => {
  if (typeof address !== 'string') {
    return new Response('address is not a string', { status: 400 });
  }

  return getPriceByAddress(env, url, address);
};
