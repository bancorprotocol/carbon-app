import {
  CFWorkerEnv,
  build403Response,
  buildOptionsResponse,
} from './../../src/functions';

export const onRequest: PagesFunction<CFWorkerEnv> = async ({
  request,
  env,
  next,
}) => {
  if (request.method === 'OPTIONS') {
    return buildOptionsResponse(request);
  }

  const response = await next();

  // Allow CORS for localhost
  const origin = request.headers.get('origin');
  if (origin === 'http://localhost:3000') {
    response.headers.set('Access-Control-Max-Age', '86400');
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  // Validate API key
  const authKey = request.headers.get('x-carbon-auth-key');
  if (authKey !== env.VITE_CARBON_API_KEY) {
    return build403Response();
  }

  return response;
};
