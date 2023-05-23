export const build403Response = (message = 'permission denied'): Response => {
  return new Response(
    JSON.stringify({
      status: {
        timestamp: new Date().toUTCString(),
        error_code: 403,
        error_message: message,
      },
    }),
    {
      status: 403,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
};

export const buildOptionsResponse = (request: Request): Response => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-carbon-auth-key',
  };

  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    return new Response(null, {
      headers: corsHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    });
  }
};
