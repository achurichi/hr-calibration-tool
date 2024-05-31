class ReferenceImage {
  fileId;
  base64;
  url;

  constructor(data) {
    this.fileId = data._id;
    this.base64 = data.base64;
    this.url = data.url;
  }
}

export default ReferenceImage;
