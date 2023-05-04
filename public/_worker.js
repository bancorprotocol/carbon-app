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

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json());
  }
  return response.text();
}

const getPriceByAddress = async (env, address) => {
  const init = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
    },
  };
  let response;
  try {
    response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD',
      init
    );
    const results = await gatherResponse(response);

    return new Response(results, init);
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
          return getPriceByAddress(env);
        default:
          new Response('api endpoint not found', { status: 404 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
