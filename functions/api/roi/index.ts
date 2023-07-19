import { CFWorkerEnv } from './../../../src/functions';

const CACHE_NAME = 'roi';

const buildRoiResponse = (
  data: any = undefined,
  error_code = 0,
  error_message: string | null = null
): Response => {
  console.log("called 15");
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
        'Cache-Control': 's-maxage=60',
      },
    }
  );
};

const getHeaders = (env: CFWorkerEnv): RequestInit<RequestInitCfProperties> => {
  console.log("called 14");
  return {
    headers: {
      'x-dune-api-key': env.DUNE_API_KEY,
    },
  };
};

const getRoiData = async (env: CFWorkerEnv) => {
  console.log("called 10");
  const response = await fetch(
    'https://api.dune.com/api/v1/query/2738515/results',
    getHeaders(env)
  );
  console.log("called 11");
  const json: any = await response.json();
  console.log("called 12");
  if (json?.result) return JSON.stringify(json.result);
  console.log("called 13");
  throw new Error('ROI data contains no results field');
};

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  waitUntil,
}) => {
  console.log("called 1");
  const cache = await caches.open(CACHE_NAME);
  console.log("called 2");
  const match = await cache.match(request);
  console.log("called 3");
  if (match) {
    console.log("called 4");
    return match;
  }
  console.log("called 5");
  try {
    const data = await getRoiData(env);
    console.log("called 6");
    const response = buildRoiResponse(data);
    console.log("called 7");
    waitUntil(cache.put(request, response.clone()));
    console.log("called 8");
    return response;
  } catch (error: any) {
    console.log("called 9");
    return buildRoiResponse(
      undefined,
      500,
      error.message || 'Internal error: failed to get ROI data'
    );
  }
};
