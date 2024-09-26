class Motion {
  descId;
  motionName;
  value;

  constructor(data) {
    this.descId = data.descId;
    this.motionName = data.motionName;
    this.value = data.value;
  }
}

export default Motion;
