/* eslint-disable import/no-anonymous-default-export */

const isIpBlocked = (request, env) => {
  const RESTRICTED_DOMAIN = '.pages.dev';
  const { hostname } = new URL(request.url);
  const ALLOWED_IPS = env.ALLOWED_IPS;
  if (hostname.includes(RESTRICTED_DOMAIN) && ALLOWED_IPS) {
    const allowedIps = ALLOWED_IPS.split(',').filter((ip) => ip !== '');
    const clientIP = request.headers.get('CF-Connecting-IP');
    if (!allowedIps.includes(clientIP)) {
      return new Response(`IP ${clientIP} isn't allowed to access this page`, {
        status: 403,
      });
    }
  }
};

const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/';

const getCMCHeaders = (env) => ({
  headers: {
    'content-type': 'application/json;charset=UTF-8',
    'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
  },
});

const fetchCMCIdByAddress = async (env, address) => {
  const res = await fetch(
    `${cmcBaseUrl}info?address=${address}`,
    getCMCHeaders(env)
  );

  const json = await res.json();
  if (json.status.error_code !== 0) {
    throw new Error(json.status.error_message);
  }

  return Object.keys(json.data)[0];
};

const fetchCMCPriceById = async (env, id) => {
  const res = await fetch(
    `${cmcBaseUrl}quotes/latest?id=${id}&convert=USD,EUR,CAD`,
    getCMCHeaders(env)
  );

  const json = await res.json();
  if (json.status.error_code !== 0) {
    throw new Error(json.status.error_message);
  }

  return json.data[id].quote;
};

const getPriceByAddress = async (env, request) => {
  const { pathname } = new URL(request.url);
  const address = pathname.split('/')[2];
  try {
    const id = await fetchCMCIdByAddress(env, address);
    const results = await fetchCMCPriceById(env, id);

    return new Response(results, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    });
  } catch (ex) {
    return new Response(ex.message, { status: 500 });
  }
};

export default {
  async fetch(request, env) {
    const isIpBlockedResponse = isIpBlocked(request, env);
    if (isIpBlockedResponse) {
      return isIpBlockedResponse;
    }

    const { pathname } = new URL(request.url);
    if (pathname.startsWith('/api/')) {
      if (pathname.startsWith('/api/price/0x')) {
        return getPriceByAddress(env, request);
      }

      return new Response('api endpoint not found', { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
