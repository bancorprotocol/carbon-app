import development from './mainnet/development';
import production from './mainnet/production';

const configs = { development, production };
const mode = import.meta.env.MODE as keyof typeof configs;
if (!configs[mode]) {
  const keys = Object.keys(configs)
    .map((v) => `"${v}"`)
    .join(' or ');
  throw new Error(`NODE_ENV should either be ${keys}, got "${mode}"`);
}

export default configs[mode];
