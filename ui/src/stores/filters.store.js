import { makeAutoObservable } from 'mobx';

class FiltersStore {
  rootStore;
  filters = new Map();

  constructor(root) {
    makeAutoObservable(this, {}, { autoBind: true });
    this.rootStore = root;
  }

  setFilter(id, value) {
    this.filters.set(id, value);
  }

  getFilter(id) {
    return this.filters.get(id);
  }
}

export default FiltersStore;
