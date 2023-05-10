import axios from 'axios';

const BASE_URL = 'https://app.carbondefi.xyz/api/';

const carbonApiAxios = axios.create({
  baseURL: BASE_URL,
});

carbonApiAxios.defaults.headers.common['x-carbon-auth-key'] =
  import.meta.env.VITE_CARBON_API_KEY;

export { carbonApiAxios };
