const proOrigin = 'https://open-api-pro.openocean.finance/v4';

const allowedEndpoints = ['reverseQuote', 'quote', 'swap', 'gasPrice'];
const allowChains = ['1', '42220', '1329', '239'];

const vaults = {
  sei: '0x773B75CfB146bd5d1095fa9d6d45637f02B05119',
  celo: '0x8cE318919438982514F9f479FDfB40D32C6ab749',
  tac: '0xBBAFF3Bf6eC4C15992c0Fb37F12491Fd62C5B496',
  ethereum: '0x60917e542aDdd13bfd1a7f81cD654758052dAdC4',
};

interface Env {
  OPENOCEAN_APIKEY: string;
  AXIOM_APIKEY: string;
  VITE_NETWORK?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const apikey = env.OPENOCEAN_APIKEY;
    if (!apikey) throw new Error('No API key available in cloudflare');
    const { searchParams } = new URL(request.url);

    // Get endpoint sent by the client & remove it
    const endpoint = searchParams.get('endpoint') ?? '';
    searchParams.delete('endpoint');
    if (!allowedEndpoints.includes(endpoint)) {
      throw new Error(`Unsupported endpoint: ${endpoint}`);
    }

    const chain = searchParams.get('chain') ?? '';
    searchParams.delete('chain');
    if (!allowChains.includes(chain)) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    const url = new URL(proOrigin + '/' + chain + '/' + endpoint);

    const network = (env.VITE_NETWORK || 'ethereum') as keyof typeof vaults;

    if (!(network in vaults)) {
      throw new Error(`Unsupported VITE_NETWORK: ${chain}`);
    }

    const vault = vaults[network];

    // Copy search params from request to openocean
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }

    if (endpoint === 'swap') {
      url.searchParams.set('referrer', vault);
      url.searchParams.set('referrerFee', '0.25');
    }

    const response = await fetch(url, {
      headers: {
        apikey,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const result = await response.json();
      const error = (result as { error?: string }).error;
      throw new Error(
        error ||
          `Response was not okay. ${response.statusText} response received.`,
      );
    }
    const result = await response.text();
    console.log('HAS AXIOM_APIKEY', !!env.AXIOM_APIKEY);
    if (env.AXIOM_APIKEY) {
      console.log('FETCH AXIOM');
      const res = await fetch(
        'https://us-east-1.aws.edge.axiom.co/v1/ingest/cf-aggregator-proxy',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.AXIOM_APIKEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            {
              level: 'info',
              message: {
                request: url.toString(),
                response: result,
              },
            },
          ]),
        },
      );
      console.log(JSON.stringify(res));
    }
    return new Response(result, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    return new Response(JSON.stringify((err as Error).message), {
      status: 500,
    });
  }
};
