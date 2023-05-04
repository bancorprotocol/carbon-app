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

const getPriceByAddress = async (env) => {
  try {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?slug=ethereum&address=0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
        },
      }
    );
    const results = await gatherResponse(response);

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
      switch (pathname) {
        case '/api/price':
          return getPriceByAddress(env);
        default:
          return new Response('api endpoint not found', { status: 404 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
