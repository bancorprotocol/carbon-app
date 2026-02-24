interface Env {
  DEX_AGGREGATOR_APIKEY: string;
  DEX_AGGREGATOR_URL: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const apikey = env.DEX_AGGREGATOR_APIKEY;
    const baseUrl = env.DEX_AGGREGATOR_URL;
    if (!apikey) throw new Error('No API key available in cloudflare env');
    if (!baseUrl) throw new Error('No URL available in cloudflare env');

    const url = baseUrl + '/quote';
    return await fetch(url, {
      method: 'POST',
      body: request.clone().body,
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
