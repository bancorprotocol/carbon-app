import { CFWorkerEnv } from './../../../src/functions';

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({ request }) => {
  const clientCountry = request.headers.get('CF-IPCountry') || '';

  return new Response('CODE: ' + clientCountry, {
    status: 200,
    headers: {
      'content-type': 'text/plain',
    },
  });
};
