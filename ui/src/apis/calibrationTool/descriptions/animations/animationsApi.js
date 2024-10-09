import { REQUESTS } from "@/apis/utils";

export const REQUEST_IDS = {
  GET_BY_NAME: "GET_ANIMATION_DESCRIPTION_BY_NAME",
  SAVE_DESCRIPTION_ITEM: "SAVE_DESCRIPTION_ITEM",
  DELETE_DESCRIPTION_ITEM: "DELETE_DESCRIPTION_ITEM",
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

  async saveItem(descriptionName, animation) {
    const { data } = await REQUESTS.post(
      REQUEST_IDS.SAVE_DESCRIPTION_ITEM,
      this.base,
      {
        descriptionName,
        animation,
      },
    );
    return data || null;
  }

  async deleteItem(descriptionName, animationId) {
    const { data } = await REQUESTS.delete(
      REQUEST_IDS.DELETE_DESCRIPTION_ITEM,
      `${this.base}?descriptionName=${descriptionName}&animationId=${animationId}`,
    );
    return data || null;
  }
}

export default AnimationsApi;
