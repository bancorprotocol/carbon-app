const BLOCKED_HOSTS = [
  'carbon-app-csq.pages.dev',
  'carbon-app-sei.pages.dev',
  'carbon-app-celo.pages.dev',
  'carbon-app-coti.pages.dev',
  'carbon-app-blast.pages.dev',
];

const NO_NO_COUNTRIES = [
  'BY', // Belarus
  'BI', // Burundi
  'CF', // Central African Republic
  'CG', // Congo
  'CD', // Congo, Democratic Republic of the
  'CU', // Cuba
  'GN', // Guinea
  'GW', // Guinea-Bissau
  'IR', // Iran, Islamic Republic of
  'IQ', // Iraq
  'KP', // Korea, Democratic People's Republic of
  'LB', // Lebanon
  'LY', // Libyan Arab Jamahiriya
  'ML', // Mali
  'MM', // Myanmar
  'RU', // Russian Federation
  'SO', // Somalia
  'SS', // South Sudan
  'SD', // Sudan
  'SY', // Syrian Arab Republic
  'UA', // Ukraine
  'VE', // Venezuela, Bolivarian Republic of
  'YE', // Yemen
  'ZW', // Zimbabwe
];

const LIMITED_COUNTRIES = [
  'US', // USA
  'PR', // Puerto Rico
  'AS', // American Samoa
  'GU', // Guam
  'MP', // Northern Mariana Islands
  'VI', // US Virgin Islands
];

const getCheckResponse = (value: boolean) => {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
};

export const onRequestGet: PagesFunction = async ({ request }) => {
  const { hostname } = new URL(request.url);
  const isBlockedHost = BLOCKED_HOSTS.includes(hostname);

  if (isBlockedHost) {
    return getCheckResponse(true);
  }

  const clientCountry = request.headers.get('CF-IPCountry') || '';
  const isBlockedCountry =
    NO_NO_COUNTRIES.concat(LIMITED_COUNTRIES).includes(clientCountry);

  if (isBlockedCountry) {
    return getCheckResponse(true);
  }

  return getCheckResponse(false);
};
