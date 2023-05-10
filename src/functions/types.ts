export interface CFWorkerEnv {
  ALLOWED_IPS: string;
  CMC_API_KEY: string;
  COINGECKO_API_KEY: string;
  VITE_CARBON_API_KEY?: string;
  ASSETS: Fetcher;
}

interface ObjectWithKeys<T> {
  [k: string]: T;
}

export type CurrencyDict = ObjectWithKeys<number>;

export type CMCResponse<T> = {
  data: T;
  status: {
    error_code: number;
    error_message: string | null;
    timestamp: string;
  };
};

export type CMCPriceResult = ObjectWithKeys<{ price: number }>;

export type CMCPriceResponse = CMCResponse<
  ObjectWithKeys<{
    quote: CMCPriceResult;
  }>
>;

export type CMCInfoResponse = CMCResponse<any>;

export type GetApiPriceResult = { data: CurrencyDict; provider: string };
