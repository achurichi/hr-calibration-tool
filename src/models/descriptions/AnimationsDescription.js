import AnimationDescription from "./AnimationDescription";

class AnimationsDescription {
  modelName;
  animations;

  constructor(data) {
    this.modelName = data.modelName;
    this.animations =
      data.animations?.map((a) => new AnimationDescription(a)) || [];
  }
}

export default AnimationsDescription;
