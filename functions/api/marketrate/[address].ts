import { CFWorkerEnv, getPriceByAddress } from './../../../src/functions';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  params: { address },
  waitUntil,
}) => {
  if (
    typeof address !== 'string' ||
    !address.startsWith('0x') ||
    address.length !== 42
  ) {
    return new Response('address is not valid', { status: 400 });
  }
  const cache = await caches.open('default');

  const match = await cache.match(request);
  if (match) return match;

  const res = await getPriceByAddress(env, request.url, address);
  waitUntil(cache.put(request, res.clone()));

  return res;
};
