import axios from "axios";
import rootStore from "@/stores/root.store";

const API_HOST = `${import.meta.env.VITE_API_URL}/api`;

export const REQUESTS = {
  get: (requestId, endpoint, config) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.get(`${API_HOST}${endpoint}`, config),
    );
  },

  post: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.post(`${API_HOST}${endpoint}`, data, config),
    );
  },

  put: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.put(`${API_HOST}${endpoint}`, data, config),
    );
  },

  delete: (requestId, endpoint, config) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.delete(`${API_HOST}${endpoint}`, config),
    );
  },

  patch: (requestId, endpoint, data, config) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.patch(`${API_HOST}${endpoint}`, data, config),
    );
  },
};
