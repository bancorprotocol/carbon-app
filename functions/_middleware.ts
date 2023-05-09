import { isIpBlocked, CFWorkerEnv } from './../src/functions';

const build403Response = (message = 'permission denied'): Response => {
  return new Response(
    JSON.stringify({
      status: {
        timestamp: new Date().toUTCString(),
        error_code: 403,
        error_message: message,
      },
    }),
    {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  next,
}) => {
  const isIpBlockedResponse = isIpBlocked(request, env);
  if (isIpBlockedResponse) {
    return isIpBlockedResponse;
  }

  const { pathname } = new URL(request.url);
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const authKey = request.headers.get('x-carbon-auth-key');
    if (authKey !== env.VITE_CARBON_API_KEY) {
      return build403Response();
    }

    if (
      origin !== null &&
      origin !== 'https://app.carbondefi.xyz' &&
      origin !== 'http://localhost:3000'
    ) {
      return build403Response();
    }

    const response = await next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  return next();
};
