import { CFWorkerEnv } from './../../../src/functions';

const BLOCKED_COUNTRIES = [
  'US', // USA
  'PR', // Puerto Rico
  'AS', // American Samoa
  'GU', // Guam
  'MP', // Northern Mariana Islands
  'VI', // US Virgin Islands
];

export const onRequestGet: PagesFunction<CFWorkerEnv> = async ({ request }) => {
  const clientCountry = request.headers.get('CF-IPCountry') || '';
  if (BLOCKED_COUNTRIES.includes(clientCountry)) {
    return new Response(JSON.stringify(true), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify(false), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};
