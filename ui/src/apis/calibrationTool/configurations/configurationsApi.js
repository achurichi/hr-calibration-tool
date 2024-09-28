import { REQUESTS } from "apis/utils";

import AnimationsApi from "./animations/animationsApi";
import MotorsApi from "./motors/motorsApi";

export const REQUEST_IDS = {
  CREATE_MANY: "CREATE_MANY",
};

class ConfigurationsApi {
  animations;
  motors;

  constructor() {
    this.animations = new AnimationsApi(this);
    this.motors = new MotorsApi(this);
  }

  get base() {
    return "/configurations";
  }

  async createMany(items) {
    const { data } = await REQUESTS.post(
      REQUEST_IDS.CREATE_MANY,
      `${this.base}/createMany`,
      { items },
    );
    return data || null;
  }
}

export default ConfigurationsApi;
