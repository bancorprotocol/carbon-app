import axios from 'axios';

export const AVAILABLE_CURRENCIES = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNH',
] as const;

export type FiatSymbol = (typeof AVAILABLE_CURRENCIES)[number];

export type FiatPriceDict = {
  [k in FiatSymbol]: number;
};

export type RoiRow = {
  APR: string;
  ROI: string;
  id: string;
};

let BASE_URL = '/api/';

if (import.meta.env.VITE_DEV_MODE) {
  BASE_URL = 'https://app.carbondefi.xyz/api/';
}

const carbonApiAxios = axios.create({
  baseURL: BASE_URL,
});

carbonApiAxios.defaults.headers.common['x-carbon-auth-key'] =
  import.meta.env.VITE_CARBON_API_KEY;

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (import.meta.env.VITE_DEV_MODE) {
      return false;
    }
    const { data } = await carbonApiAxios.get<boolean>('/check');
    return data;
  },
  getMarketRate: async (
    address: string,
    convert: readonly FiatSymbol[]
  ): Promise<FiatPriceDict> => {
    const {
      data: { data },
    } = await carbonApiAxios.get<{ data: FiatPriceDict }>(
      `marketrate/${address}`,
      {
        params: { convert: convert.join(',') },
      }
    );
    return data;
  },
  getRoi: async (): Promise<RoiRow[]> => {
    const {
      data: { data },
    } = await carbonApiAxios.get<{ data: RoiRow[] }>('roi');
    console.log(data);
    return data;
  },
};

export { carbonApiAxios, carbonApi };
