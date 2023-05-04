interface Env {
  ALLOWED_IPS: string;
  CMC_API_KEY: string;
  ASSETS: Fetcher;
}

const isIpBlocked = (request: Request, env: Env) => {
  const RESTRICTED_DOMAIN = '.pages.dev';
  const { hostname } = new URL(request.url);
  const ALLOWED_IPS = env.ALLOWED_IPS;
  if (hostname.includes(RESTRICTED_DOMAIN) && ALLOWED_IPS) {
    const allowedIps = ALLOWED_IPS.split(',').filter((ip) => ip !== '');
    const clientIP = request.headers.get('CF-Connecting-IP') || '';
    if (!allowedIps.includes(clientIP)) {
      return new Response(`IP ${clientIP} isn't allowed to access this page`, {
        status: 403,
      });
    }
  }
};

const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/';

const getCMCHeaders = (env: Env) => ({
  headers: {
    'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
  },
});

const fetchCMCIdByAddress = async (env: Env, address: string) => {
  const res = await fetch(
    `${cmcBaseUrl}info?address=${address}`,
    getCMCHeaders(env)
  );

  const json = await res.json<{ data: any; status: any }>();
  if (json.status.error_code !== 0) {
    throw new Error(
      json.status.error_message + ' fetchCMCIdByAddress ' + address
    );
  }

  return Object.keys(json.data)[0];
};

const fetchCMCPriceById = async (env: Env, id: string, convert = 'USD') => {
  const res = await fetch(
    `${cmcBaseUrl}quotes/latest?id=${id}&convert=${convert}`,
    getCMCHeaders(env)
  );

  const json = await res.json<{ data: any; status: any }>();
  if (json.status.error_code !== 0) {
    throw new Error(json.status.error_message + ' fetchCMCPriceById ' + id);
  }

  return json.data[id].quote;
};

const fetchCMCPriceByAddress = async (
  env: Env,
  address: string,
  convert: string
) => {
  try {
    const id = await fetchCMCIdByAddress(env, address);

    const res = await fetchCMCPriceById(env, id, convert);

    const prices: { [k in string]: number } = {};
    Object.keys(res).forEach((c) => {
      prices[c] = res[c].price;
    });

    return prices;
  } catch (ex: any) {
    throw new Error(`fetchCMCPriceByAddress error: ${ex.message}`);
  }
};

const getPriceByAddress = async (request: Request, env: Env) => {
  const { pathname, searchParams } = new URL(request.url);
  const address = pathname.split('/')[3];
  const convertString = searchParams.get('convert') || 'USD';

  try {
    const res = await fetchCMCPriceByAddress(env, address, convertString);

    return new Response(JSON.stringify(res), {
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (ex: any) {
    return new Response(ex.message, { status: 500 });
  }
};

export default {
  async fetch(request: Request, env: Env) {
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
  },
};
