import AnimationConfiguration from "./AnimationConfiguration";

class AnimationsConfiguration {
  modelName;
  robotName;
  bodyName;
  animations;

  constructor(data) {
    this.modelName = data.modelName;
    this.robotName = data.robotName;
    this.bodyName = data.bodyName;
    this.animations =
      data.animations?.map((a) => new AnimationConfiguration(a)) || [];
  }
}

export default AnimationsConfiguration;
