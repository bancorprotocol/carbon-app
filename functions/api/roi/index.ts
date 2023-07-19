import { CFWorkerEnv } from './../../../src/functions';

const CACHE_NAME = 'roi';

const buildRoiResponse = (
  data: any = undefined,
  error_code = 0,
  error_message: string | null = null
): Response => {
  return new Response(
    JSON.stringify({
      data,
      status: {
        timestamp: new Date().toUTCString(),
        error_code,
        error_message: error_code
          ? error_message || 'Internal error: failed to get ROI data'
          : null,
      },
    }),
    {
      status: error_code || undefined,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': 's-maxage=300',
      },
    }
  );
};

const getHeaders = (env: CFWorkerEnv): RequestInit<RequestInitCfProperties> => {
  return {
    headers: {
      'x-dune-api-key': env.DUNE_API_KEY,
    },
  };
};

const getRoiData = async (env: CFWorkerEnv) => {
  const response = await fetch(
    'https://api.dune.com/api/v1/query/2738515/results',
    getHeaders(env)
  );
  const json: any = await response.json();
  if (json?.result?.rows) return json.result.rows;
  throw new Error('ROI data contains no results field');
};

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  waitUntil,
}) => {
  const cache = await caches.open(CACHE_NAME);
  const match = await cache.match(request);
  if (match) {
    return match;
  }
  try {
    const data = await getRoiData(env);

    const response = buildRoiResponse(data);

    waitUntil(cache.put(request, response.clone()));

    return response;
  } catch (error: any) {
    return buildRoiResponse(
      undefined,
      500,
      error.message || 'Internal error: failed to get ROI data'
    );
  }
};
