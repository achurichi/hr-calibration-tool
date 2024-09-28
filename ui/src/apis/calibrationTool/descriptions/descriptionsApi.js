import { REQUESTS } from "apis/utils";

import AnimationsApi from "./animations/animationsApi";
import MotorsApi from "./motors/motorsApi";

export const REQUEST_IDS = {
  CREATE_DESCRIPTIONS: "CREATE_DESCRIPTIONS",
  DELETE_DESCRIPTIONS: "DELETE_DESCRIPTIONS",
  GET_ALL_DESCRIPTION_NAMES: "GET_ALL_DESCRIPTION_NAMES",
  GET_NAMES_BY_ASSEMBLY: "GET_NAMES_BY_ASSEMBLY",
};

class DescriptionsApi {
  animations;
  motors;

  constructor() {
    this.animations = new AnimationsApi(this);
    this.motors = new MotorsApi(this);
  }

  get base() {
    return "/descriptions";
  }

  async create(name) {
    await REQUESTS.post(REQUEST_IDS.CREATE_DESCRIPTIONS, this.base, { name });
  }

  async deleteByName(name) {
    await REQUESTS.delete(
      REQUEST_IDS.DELETE_DESCRIPTIONS,
      `${this.base}?name=${name}`,
    );
  }

  async getAllDescriptionNames() {
    const { data } = await REQUESTS.get(
      REQUEST_IDS.GET_ALL_DESCRIPTION_NAMES,
      `${this.base}/allDescriptionNames`,
    );
    return data || null;
  }

  async namesByAssembly(assembliesIds) {
    const { data } = await REQUESTS.post(
      REQUEST_IDS.GET_NAMES_BY_ASSEMBLY,
      `${this.base}/namesByAssembly`,
      { assemblies: assembliesIds },
    );
    return data || null;
  }
}

export default DescriptionsApi;
