import AnimationsApi from "./animations/animationsApi";
import MotorsApi from "./motors/motorsApi";

export const REQUEST_IDS = {};

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
}

export default ConfigurationsApi;
