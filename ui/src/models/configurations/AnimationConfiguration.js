import Motion from "./Motion";

class AnimationConfiguration {
  animationId;
  animationName;
  animationType;
  motions;

  constructor(data) {
    this.animationId = data.animationId;
    this.animationName = data.animationName;
    this.animationType = data.animationType;
    this.motions = data.motions?.map((m) => new Motion(m)) || [];
  }
}

export default AnimationConfiguration;
