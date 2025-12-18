const proOrigin = 'https://open-api-pro.openocean.finance/v4';

const allowedEndpoints = ['reverseQuote', 'quote', 'swap', 'gasPrice'];

const vaults = {
  sei: '0x773B75CfB146bd5d1095fa9d6d45637f02B05119',
  celo: '0x8cE318919438982514F9f479FDfB40D32C6ab749',
  tac: '0xBBAFF3Bf6eC4C15992c0Fb37F12491Fd62C5B496',
};

export const onRequestGet: PagesFunction = async ({ request, env }) => {
  const apikey = (env as any)['OPENOCEAN_APIKEY'];
  if (!apikey) throw new Error('No API key available in cloudflare');
  const { searchParams } = new URL(request.url);

  // Get endpoint sent by the client & remove it
  const endpoint = searchParams.get('endpoint') ?? '';
  searchParams.delete('endpoint');
  const chain = searchParams.get('chain') ?? '';
  searchParams.delete('chain');

  if (!allowedEndpoints.includes(endpoint)) {
    throw new Error('Unsupported endpoint');
  }
  const url = new URL(proOrigin + '/' + chain + '/' + endpoint);

  const network = (env as any).VITE_NETWORK as keyof typeof vaults;
  const vault = vaults[network] || '0x60917e542aDdd13bfd1a7f81cD654758052dAdC4';

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
  const result = await response.json();
  if (!response.ok) {
    const error = (result as { error?: string }).error;
    throw new Error(
      error ||
        `Response was not okay. ${response.statusText} response received.`,
    );
  }
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
      Expires: '0',
      Pragma: 'no-cache',
    },
  });
};
