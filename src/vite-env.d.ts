/// <reference types="vite/client" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly VITE_NETWORK: string;
  readonly VITE_CHAIN_RPC_URL: string;
  readonly VITE_TENDERLY_ACCESS_KEY: string;
  readonly VITE_SDK_VERBOSITY: 0 | 1 | 2;
  readonly VITE_LEGACY_TRADE_BY_SOURCE_RANGE: boolean;
  readonly VITE_USE_STORED_CHAIN_SWITCH: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
