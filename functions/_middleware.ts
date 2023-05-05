import { isIpBlocked, CFWorkerEnv } from './../src/functions';

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
    if (origin === 'https://app.carbondefi.xyz') {
      return new Response('origin not allowed', { status: 403 });
    }

    const response = await next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
  }

  return next();
};
