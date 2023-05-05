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

  // const match = await cache.match(request);
  // if (match) return match;

  try {
    const data = await getPriceByAddress(env, request.url, address);
    const response = new Response(
      JSON.stringify({
        data,
        status: {
          timestamp: new Date().toUTCString(),
          error_code: 0,
          error_message: undefined,
        },
      }),
      {
        headers: {
          'content-type': 'application/json',
          'Cache-Control': 'max-age:300',
        },
      }
    );
    waitUntil(cache.put(request, response.clone()));

    return response;
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        data: undefined,
        status: {
          timestamp: new Date().toUTCString(),
          error_code: 500,
          error_message:
            error.message || 'Internal error: failed to get prices',
        },
      }),
      { status: 500 }
    );
  }
};
