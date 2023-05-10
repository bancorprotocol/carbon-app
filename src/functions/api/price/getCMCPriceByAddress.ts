import type {
  CFWorkerEnv,
  CMCPriceResult,
  CMCResponse,
  CurrencyDict,
} from 'functions/types';
import { CMCPriceResponse } from 'functions/types';

const baseUrl = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/';

const getHeaders = (
  env: CFWorkerEnv
): RequestInit<RequestInitCfProperties> => ({
  headers: {
    'X-CMC_PRO_API_KEY': env.CMC_API_KEY,
  },
});

const validateResponse = async <T extends CMCResponse<unknown>>(
  res: Response,
  label: string,
  label2?: string
): Promise<T> => {
  const json = await res.json<T>();
  if (json.status.error_code !== 0) {
    throw new Error(`${json.status.error_message} | ${label}: ${label2}`);
  }
  return json;
};

const fetchCMCIdByAddress = async (
  env: CFWorkerEnv,
  address: string
): Promise<string> => {
  const res = await fetch(`${baseUrl}info?address=${address}`, getHeaders(env));

  const json = await validateResponse<CMCPriceResponse>(
    res,
    'fetchCMCIdByAddress',
    address
  );

  return Object.keys(json.data)[0];
};

const fetchCMCPriceById = async (
  env: CFWorkerEnv,
  id: string,
  convert = 'USD'
): Promise<CMCPriceResult> => {
  const res = await fetch(
    `${baseUrl}quotes/latest?id=${id}&convert=${convert}`,
    getHeaders(env)
  );

  const json = await validateResponse<CMCPriceResponse>(
    res,
    'fetchCMCPriceById',
    id
  );

  return json.data[id].quote;
};

export const getCMCPriceByAddress = async (
  env: CFWorkerEnv,
  address: string,
  convert: string
): Promise<CurrencyDict> => {
  const id = await fetchCMCIdByAddress(env, address);
  const res = await fetchCMCPriceById(env, id, convert);

  const prices: CurrencyDict = {};
  Object.keys(res).forEach((c) => {
    prices[c] = res[c].price;
  });

  return prices;
};
