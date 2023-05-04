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

const getPriceByAddress = async (env, request) => {
  const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/';
  const init = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
    },
  };
  const { pathname } = new URL(request.url);
  const address = pathname.split('/')[2];
  try {
    const response = await fetch(`${cmcBaseUrl}info?address=${address}`, init);

    const id = Object.keys((await response.json()).data)[0];

    const response2 = await fetch(`${cmcBaseUrl}quotes/latest?id=${id}`, init);
    const results = await response2.json();

    return new Response(results.data[id].quote, {
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
      switch (pathname) {
        case '/api/price':
          return getPriceByAddress(env, request);
        default:
          return new Response('api endpoint not found', { status: 404 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
