import MotorsApi from "./motors/motorsApi";

export const REQUEST_IDS = {};

class ConfigurationsApi {
  motors;

  constructor() {
    this.motors = new MotorsApi(this);
  }

  get base() {
    return "/configurations";
  }
}

export default ConfigurationsApi;
