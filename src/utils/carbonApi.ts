import axios from 'axios';
import { FiatPriceDict, FiatSymbol } from 'store/useFiatCurrencyStore';

const BASE_URL = '/api/';

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
};

export { carbonApiAxios, carbonApi };
