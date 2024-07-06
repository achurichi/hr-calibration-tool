import Motion from "./Motion";

class AnimationConfiguration {
  animationId;
  animationName;
  motions;

  constructor(data) {
    this.animationId = data.animationId;
    this.animationName = data.animationName;
    this.motions = data.motions?.map((m) => new Motion(m)) || [];
  }
}

export default AnimationConfiguration;
