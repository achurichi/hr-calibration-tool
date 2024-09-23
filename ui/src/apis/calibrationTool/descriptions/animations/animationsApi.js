import { REQUESTS } from "apis/utils";

export const REQUEST_IDS = {
  GET_BY_NAME: "GET_DESCRIPTION_BY_NAME",
};

class AnimationsApi {
  constructor(parent) {
    this.parent = parent;
  }

  get base() {
    return `${this.parent.base}/animations`;
  }

  async getByName(name) {
    const { data } = await REQUESTS.get(
      REQUEST_IDS.GET_BY_NAME,
      `${this.base}?name=${name}`,
    );
    return data || null;
  }
}

export default AnimationsApi;
