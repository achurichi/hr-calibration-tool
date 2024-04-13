class Group {
  id;
  name;
  description;

  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.description = data.description;
  }
}

export default Group;
