/* eslint-disable import/no-anonymous-default-export */
export default {
  async fetch(request, env) {
    const RESTRICTED_DOMAIN = '.pages.dev';
    const url = new URL(request.url);
    const ALLOWED_IPS = env.ALLOWED_IPS;
    if (url.hostname.includes(RESTRICTED_DOMAIN) && ALLOWED_IPS) {
      const allowedIps = ALLOWED_IPS.split(',').filter((ip) => ip !== '');
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (!allowedIps.includes(clientIP)) {
        return new Response(
          `IP ${clientIP} isn't allowed to access this page`,
          { status: 403 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  },
};
