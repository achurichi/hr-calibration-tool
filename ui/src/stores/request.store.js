import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import { STATUS_TYPES } from "constants/status";

class RequestStore {
  rootStore;
  status = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setStatus(id, type, message = null) {
    this.status.set(id, { type, message });
  }

  getStatus(id) {
    if (!this.status.has(id)) {
      this.setStatus(id, STATUS_TYPES.INITIAL, null);
    }
    return this.status.get(id);
  }

  isLoading(id) {
    if (Array.isArray(id)) {
      return id.some((i) => this.isLoading(i));
    }
    return this.getStatus(id).type === STATUS_TYPES.IN_PROGRESS;
  }

  async request(id, requestFn, shouldThrow = false, notifyError = true) {
    try {
      this.setStatus(id, STATUS_TYPES.IN_PROGRESS);
      const response = await requestFn();
      this.setStatus(id, STATUS_TYPES.SUCCESS);
      return response;
    } catch (err) {
      this.setStatus(id, STATUS_TYPES.ERROR);
      if (notifyError) {
        console.log(err);
        toast.error(err.response?.data || "Request failed");
      }
      if (shouldThrow) {
        throw err;
      }
      return { ...err.response, data: null };
    }
  }
}

export default RequestStore;
