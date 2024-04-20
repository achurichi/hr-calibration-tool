import { makeAutoObservable } from "mobx";

import { STATUS } from "constants/status";

class StatusStore {
  rootStore;
  status = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setStatus(id, status) {
    this.status.set(id, status);
  }

  getStatus(id) {
    if (!this.status.has(id)) {
      this.setStatus(id, STATUS.INITIAL);
    }
    return this.status.get(id);
  }

  isLoading(id) {
    if (Array.isArray(id)) {
      return id.some((i) => this.isLoading(i));
    }
    return this.getStatus(id) === STATUS.LOADING;
  }
}

export default StatusStore;
