import AnimationConfiguration from "./AnimationConfiguration";

class AnimationsConfiguration {
  descriptionName;
  assembly;
  bodyName;
  animations;

  constructor(data) {
    this.descriptionName = data.descriptionName;
    this.assembly = data.assembly;
    this.bodyName = data.bodyName;
    this.animations =
      data.animations?.map((a) => new AnimationConfiguration(a)) || [];
  }
}

export default AnimationsConfiguration;
