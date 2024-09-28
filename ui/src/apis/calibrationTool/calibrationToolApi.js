import ConfigurationsApi from "./configurations/configurationsApi";
import DescriptionsApi from "./descriptions/descriptionsApi";
import ImagesApi from "./images/imagesApi";

class CalibrationToolApi {
  configurations;
  descriptions;
  images;

  constructor() {
    this.configurations = new ConfigurationsApi();
    this.descriptions = new DescriptionsApi();
    this.images = new ImagesApi();
  }
}

export default CalibrationToolApi;
