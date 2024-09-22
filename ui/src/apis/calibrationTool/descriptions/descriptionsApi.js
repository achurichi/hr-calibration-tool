import { REQUESTS } from "apis/utils";

import MotorsApi from "./motors/motorsApi";

export const REQUEST_IDS = {
  GET_NAMES_BY_ASSEMBLY: "GET_NAMES_BY_ASSEMBLY",
};

class DescriptionsApi {
  motors;

  constructor() {
    this.motors = new MotorsApi(this);
  }

  get base() {
    return "/descriptions";
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
