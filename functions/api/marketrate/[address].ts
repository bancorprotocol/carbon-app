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

  const data = await getPriceByAddress(env, request.url, address);
  const response = new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'max-age:120',
    },
  });
  waitUntil(cache.put(request, response.clone()));

  return response;
};
