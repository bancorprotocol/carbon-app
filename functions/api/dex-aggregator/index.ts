const allowChains = [1, 42220, 1329, 239];

interface Env {
  DEX_AGGREGATOR_APIKEY: string;
  AXIOM_APIKEY: string;
  VITE_NETWORK?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const apikey = env.DEX_AGGREGATOR_APIKEY;
    if (!apikey) throw new Error('No API key available in cloudflare');
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

    const url = 'https://agg-api-458865443958.europe-west1.run.app/v1/quote';
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${env.DEX_AGGREGATOR_APIKEY}`,
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
    if (env.AXIOM_APIKEY) {
      await fetch(
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
      ).catch((err) => console.error(err)); // avoid axiom to break the whole function if fails
    }
    return new Response(result, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err) {
    console.error(err);
    const body = JSON.stringify((err as Error).message);
    return new Response(body, { status: 500 });
  }
};
