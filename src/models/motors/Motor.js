class Motor {
  id;
  name;
  description;
  groupId;
  groupName;

  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.description = data.description;
    this.groupId = data.groupId;
    this.groupName = data.groupName;
  }
}

export default Motor;
