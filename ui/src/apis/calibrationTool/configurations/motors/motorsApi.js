import { REQUESTS } from '@/apis/utils';

export const REQUEST_IDS = {
  ADD_ITEMS: 'ADD_ITEMS',
  DELETE_ITEM: 'DELETE_ITEM',
  GET_BY_DESCRIPTION_AND_ASSEMBLY: 'GET_MOTOR_CONFIGURATION_BY_DESCRIPTION_AND_ASSEMBLY',
  SAVE_CONFIGURATION_ITEM: 'SAVE_CONFIGURATION_ITEM',
};

class MotorsApi {
  constructor(parent) {
    this.parent = parent;
  }

  get base() {
    return `${this.parent.base}/motors`;
  }

  async getByDescriptionAndAssembly(descriptionName, assembly) {
    const { data } = await REQUESTS.get(
      REQUEST_IDS.GET_BY_DESCRIPTION_AND_ASSEMBLY,
      `${this.base}?descriptionName=${descriptionName}&assembly=${assembly}`
    );
    return data || null;
  }

  async saveItem(descriptionName, assembly, motor) {
    const { data } = await REQUESTS.post(REQUEST_IDS.SAVE_CONFIGURATION_ITEM, `${this.base}`, {
      descriptionName,
      assembly,
      motor,
    });
    return data || null;
  }

  async addItems(motorsMap) {
    const { data } = await REQUESTS.post(REQUEST_IDS.ADD_ITEMS, `${this.base}/addItems`, { motorsMap });
    return data || null;
  }

  async deleteItem(assembly, motorId) {
    const { data } = await REQUESTS.delete(
      REQUEST_IDS.DELETE_ITEM,
      `${this.base}?assembly=${assembly}&motorId=${motorId}`
    );
    return data || null;
  }
}

export default MotorsApi;
