class Position {
  value;
  description;
  imageUrls;

  constructor(data) {
    this.value = data.value;
    this.description = data.description;
    this.imageUrls = data.imageUrls;
  }
}

export default Position;
