import MotionDescription from "./MotionDescription";

class AnimationDescription {
  id;
  name;
  type;
  configDescription;
  images;
  motions;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.configDescription = data.configDescription;
    this.images = data.images || [];
    this.motions =
      data.motions?.map((motion) => new MotionDescription(motion)) || [];
  }
}

export default AnimationDescription;
