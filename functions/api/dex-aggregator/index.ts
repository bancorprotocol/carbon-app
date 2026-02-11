const allowChains = [1, 42220, 1329, 239];

interface Env {
  DEX_AGGREGATOR_APIKEY: string;
  DEX_AGGREGATOR_URL: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const apikey = env.DEX_AGGREGATOR_APIKEY;
    const baseUrl = env.DEX_AGGREGATOR_URL;
    if (!apikey) throw new Error('No API key available in cloudflare env');
    if (!baseUrl) throw new Error('No URL available in cloudflare env');
    const { searchParams } = new URL(request.url);

    const entries = Object.fromEntries(searchParams.entries());
    // Need to force type conversion for the backend
    const body = {
      ...entries,
      chainId: Number(entries.chainId),
      slippage: Number(entries.slippage),
      tradeBySource: entries.tradeBySource === 'true',
    };
    if (!allowChains.includes(body.chainId)) {
      throw new Error(`Unsupported chain: ${body.chainId}`);
    }

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
