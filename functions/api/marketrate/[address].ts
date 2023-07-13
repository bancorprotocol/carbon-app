import { CFWorkerEnv, getPriceByAddress } from './../../../src/functions';

const buildPriceResponse = (
  data: any = undefined,
  provider: string | null = null,
  error_code = 0,
  error_message: string | null = null
): Response => {
  return new Response(
    JSON.stringify({
      data,
      status: {
        provider,
        timestamp: new Date().toUTCString(),
        error_code,
        error_message: error_code
          ? error_message || 'Internal error: failed to get prices'
          : null,
      },
    }),
    {
      status: error_code || undefined,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 'max-age:60',
        expires: new Date(Date.now() + 60 * 1000).toUTCString(),
      },
    }
  );
};

const validateRequest = (
  request: Request,
  address: string | string[]
): Response | undefined => {
  if (
    typeof address !== 'string' ||
    !address.startsWith('0x') ||
    address.length !== 42
  ) {
    return buildPriceResponse(
      undefined,
      undefined,
      400,
      'Bad request: address is not a valid Ethereum address'
    );
  }
};

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  params: { address },
  waitUntil,
}) => {
  const invalidRequest = validateRequest(request, address);
  if (invalidRequest) return invalidRequest;

  const cache = await caches.open('marketrate');

  const match = await cache.match(request);
  if (match) {
    const age = match.headers.get('Age');
    if (age && parseInt(age) < 60) {
      return match;
    }
  }

  try {
    const { data, provider } = await getPriceByAddress(
      env,
      request.url,
      address as string
    );
    const response = buildPriceResponse(data, provider);

    // TODO cache only successful responses?
    waitUntil(cache.put(request, response.clone()));

    return response;
  } catch (error: any) {
    return buildPriceResponse(
      undefined,
      undefined,
      500,
      error.message || 'Internal error: failed to get prices'
    );
  }
};
