import config from 'config';
const proOrigin = 'https://open-api-pro.openocean.finance';

const allowedEndpoints = ['reverseQuote', 'quote', 'swap'];

export const onRequestGet: PagesFunction = async ({ request }) => {
  const apikey = process.env.OPENOCEAN_APIKEY;
  if (!apikey) throw new Error('No API key available in cloudflare');
  const { searchParams } = new URL(request.url);

  // Get endpoint sent by the client & remove it
  const endpoint = searchParams.get('endpoint') ?? '';
  searchParams.delete('endpoint');
  if (allowedEndpoints.includes(endpoint)) {
    throw new Error('Unsupported endpoint');
  }
  const url = new URL(proOrigin + endpoint);

  if (endpoint === 'swap') {
    url.searchParams.set('referrer', config.addresses.carbon.vault);
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
