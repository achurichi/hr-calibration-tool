import MotionDescription from './MotionDescription';

class AnimationDescription {
  id;
  name;
  type;
  configInstructions;
  images;
  motions;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.configInstructions = data.configInstructions;
    this.images = data.images || [];
    this.motions = data.motions?.map((motion) => new MotionDescription(motion)) || [];
  }
}

export default AnimationDescription;
