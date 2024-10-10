import Motion from './Motion';

class AnimationConfiguration {
  descId;
  animationName;
  animationType;
  motions;

  constructor(data) {
    this.descId = data.descId;
    this.animationName = data.animationName;
    this.animationType = data.animationType;
    this.motions = data.motions?.map((m) => new Motion(m)) || [];
  }
}

export default AnimationConfiguration;
