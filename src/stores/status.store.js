import { makeAutoObservable } from "mobx";

import { STATUS_TYPES } from "constants/status";

class StatusStore {
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
    return this.getStatus(id).type === STATUS_TYPES.LOADING;
  }
}

export default StatusStore;
