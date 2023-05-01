const restrictPagesByIp = async ({ request, next, env }) => {
  const url = new URL(request.url);
  if (url.includes('carbon-app-csq.pages.dev')) {
    const allowedIpsStr = env.ALLOWED_IPS;
    if (allowedIpsStr) {
      const allowedIps = allowedIpsStr.split(',').filter((ip) => ip !== '');
      const clientIP = request.headers.get('CF-Connecting-IP');
      if (clientIP && allowedIps.includes(clientIP)) {
        return next();
      }
      return new Response('You are not allowed to access this page', {
        status: 403,
      });
    }
  }
  next();
};

export const onRequest = [restrictPagesByIp];
