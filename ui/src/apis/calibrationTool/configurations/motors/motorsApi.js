import { REQUESTS } from "apis/utils";

export const REQUEST_IDS = {
  GET_BY_DESCRIPTION_AND_ASSEMBLY: "GET_BY_DESCRIPTION_AND_ASSEMBLY",
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
      `${this.base}?descriptionName=${descriptionName}&assembly=${assembly}`,
    );
    return data || null;
  }
}

export default MotorsApi;
