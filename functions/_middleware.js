const restrictPagesByIp = async ({ request, next, env }) => {
  try {
    const url = new URL(request.url);
    console.log('url', url);
    console.log('ips', env?.ALLOWED_IPS);
    console.log('client ip', request?.headers?.get('CF-Connecting-IP'));
    // if (url.includes('carbon-app-csq.pages.dev')) {
    //   const allowedIpsStr = env.ALLOWED_IPS;
    //   if (allowedIpsStr) {
    //     const allowedIps = allowedIpsStr.split(',').filter((ip) => ip !== '');
    //     const clientIP = request.headers.get('CF-Connecting-IP');
    //     if (clientIP && allowedIps.includes(clientIP)) {
    //       return next();
    //     }
    //     return new Response('You are not allowed to access this page', {
    //       status: 403,
    //     });
    //   }
    // }
    next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
};

export const onRequest = [restrictPagesByIp];
