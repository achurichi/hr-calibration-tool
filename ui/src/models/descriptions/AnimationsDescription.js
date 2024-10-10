import AnimationDescription from './AnimationDescription';

class AnimationsDescription {
  name;
  animations;

  constructor(data) {
    this.name = data.name;
    this.animations = data.animations?.map((a) => new AnimationDescription(a)) || [];
  }
}

export default AnimationsDescription;
