import axios from "axios";
import rootStore from "stores/root.store";

const API_HOST = `${process.env.REACT_APP_API_URL}/api`;

export const REQUESTS = {
  get: (requestId, endpoint, data = undefined) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.get(API_HOST + endpoint, data),
    );
  },

  post: (requestId, endpoint, data, header) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.post(API_HOST + endpoint, data, header),
    );
  },

  put: (requestId, endpoint, data, header) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.put(API_HOST + endpoint, data, header),
    );
  },

  delete: (requestId, endpoint, header) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.delete(API_HOST + endpoint, header),
    );
  },

  patch: (requestId, endpoint, data, header) => {
    return rootStore.requestStore.request(requestId, () =>
      axios.patch(API_HOST + endpoint, data, header),
    );
  },
};
