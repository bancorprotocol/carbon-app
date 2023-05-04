import type { CFWorkerEnv } from './types';
import { isIpBlocked } from './ipBlock';
import { getPriceByAddress } from './api/price';

export async function fetch(request: Request, env: CFWorkerEnv) {
  const isIpBlockedResponse = isIpBlocked(request, env);
  if (isIpBlockedResponse) {
    return isIpBlockedResponse;
  }

  const { pathname } = new URL(request.url);
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/price/0x')) {
      return getPriceByAddress(request, env);
    }

    return new Response('api endpoint not found', { status: 404 });
  }

  return env.ASSETS.fetch(request);
}
