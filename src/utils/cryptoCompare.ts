import axios from 'axios';

const CRYPTO_COMPARE_URL = 'https://min-api.cryptocompare.com/';

const cryptoCompareAxios = axios.create({
  baseURL: CRYPTO_COMPARE_URL,
});

cryptoCompareAxios.defaults.headers.common[
  'authorization'
] = `Apikey ${process.env.REACT_APP_CRYPTO_COMPARE}`;

export { cryptoCompareAxios };
