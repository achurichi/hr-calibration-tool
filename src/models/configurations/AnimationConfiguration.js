import Motion from "./Motion";

class AnimationConfiguration {
  animationId;
  motions;

  constructor(data) {
    this.animationId = data.animationId;
    this.motions = data.motions?.map((m) => new Motion(m)) || [];
  }
}

export default AnimationConfiguration;
