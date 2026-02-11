/**
 * 1: Ethereum
 * 42220: Celo
 * 1329: Sei
 * 239: TAC
 * 2632500: Coti
 */
const allowChains = ['1', '42220', '1329', '239', '2632500'];

interface Env {
  DEX_AGGREGATOR_APIKEY: string;
  DEX_AGGREGATOR_URL: string;
}

const allowedParams = [
  'chainId',
  'sourceToken',
  'targetToken',
  'amount',
  'tradeBySource',
  'slippage',
  'recipient',
  'quoteId',
];

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const apikey = env.DEX_AGGREGATOR_APIKEY;
    const baseUrl = env.DEX_AGGREGATOR_URL;
    if (!apikey) throw new Error('No API key available in cloudflare env');
    if (!baseUrl) throw new Error('No URL available in cloudflare env');
    const { searchParams } = new URL(request.url);

    const entries: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (allowedParams.includes(key)) {
        entries[key] = value;
      }
    }

    if (!entries.slippage) throw new Error('No Slippage provided');
    if (!allowChains.includes(entries.chainId)) {
      throw new Error(`Unsupported chain: ${entries.chainId}`);
    }

    // Need to force type conversion for the backend
    const body = {
      ...entries,
      chainId: Number(entries.chainId),
      slippage: Number(entries.slippage),
      tradeBySource: entries.tradeBySource === 'true',
    };

    const url = baseUrl + '/quote';
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${apikey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.error(err);
    const body = JSON.stringify({ error: (err as Error).message });
    return new Response(body, { status: 500 });
  }
};
