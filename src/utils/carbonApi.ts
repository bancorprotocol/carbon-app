import axios from 'axios';

const BASE_URL = 'api/';

const carbonApiAxios = axios.create({
  baseURL: BASE_URL,
});

carbonApiAxios.defaults.params = { key: import.meta.env.VITE_CARBON_API_KEY };

export { carbonApiAxios };
