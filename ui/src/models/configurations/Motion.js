class Motion {
  motionId;
  motionName;
  value;

  constructor(data) {
    this.motionId = data.motionId;
    this.motionName = data.motionName;
    this.value = data.value;
  }
}

export default Motion;
