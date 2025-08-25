import config from 'config';

export const tonCenter =
  config.mode === 'development'
    ? 'https://rp-testnet.turin.tac.build'
    : 'https://rp.mainnet.tac.build';
