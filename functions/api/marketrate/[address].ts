import { CFWorkerEnv, getPriceByAddress } from './../../../src/functions';

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({
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
    return new Response(
      JSON.stringify({
        data: undefined,
        status: {
          provider: undefined,
          timestamp: new Date().toUTCString(),
          error_code: 400,
          error_message: 'Bad request: address is not a valid Ethereum address',
        },
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
  const cache = await caches.open('default');

  const match = await cache.match(request);
  if (match) return match;

  try {
    const { data, provider } = await getPriceByAddress(
      env,
      request.url,
      address
    );
    const response = new Response(
      JSON.stringify({
        data,
        status: {
          provider,
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
          provider: undefined,
          timestamp: new Date().toUTCString(),
          error_code: 500,
          error_message:
            error.message || 'Internal error: failed to get prices',
        },
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
};
