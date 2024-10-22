import axios from 'axios';
import rootStore from '@/stores/root.store';

const API_URL =
  window.location.protocol === 'https:'
    ? `https://${window.location.host}/api`
    : `http://${window.location.hostname}:${import.meta.env.VITE_API_PORT}`;

export const REQUESTS = {
  get: (requestId, endpoint, config) => {
    return rootStore.requestStore.request(requestId, () => axios.get(`${API_URL}${endpoint}`, config));
  },

  post: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () => axios.post(`${API_URL}${endpoint}`, data, config));
  },

  put: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () => axios.put(`${API_URL}${endpoint}`, data, config));
  },

  delete: (requestId, endpoint, config) => {
    return rootStore.requestStore.request(requestId, () => axios.delete(`${API_URL}${endpoint}`, config));
  },

  patch: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () => axios.patch(`${API_URL}${endpoint}`, data, config));
  },
};
