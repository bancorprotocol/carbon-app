import axios from 'axios';

// const BASE_URL = 'https://app.carbondefi.xyz/api/';
const BASE_URL =
  'https://610-popup-view-fullscreen-on.carbon-app-csq.pages.dev/api/';
const carbonApiAxios = axios.create({
  baseURL: BASE_URL,
});

carbonApiAxios.defaults.params = { key: import.meta.env.VITE_CARBON_API_KEY };

export { carbonApiAxios };
