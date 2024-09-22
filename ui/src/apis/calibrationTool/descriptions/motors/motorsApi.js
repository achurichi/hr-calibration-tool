import { REQUESTS } from "apis/utils";

export const REQUEST_IDS = {
  GET_BY_NAME: "GET_BY_NAME",
};

class MotorsApi {
  constructor(parent) {
    this.parent = parent;
  }

  get base() {
    return `${this.parent.base}/motors`;
  }

  async getByName(name) {
    const { data } = await REQUESTS.get(
      REQUEST_IDS.GET_BY_NAME,
      `${this.base}?name=${name}`,
    );
    return data || null;
  }
}

export default MotorsApi;
