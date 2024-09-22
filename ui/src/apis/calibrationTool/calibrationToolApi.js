import ConfigurationsApi from "./configurations/configurationsApi";
import DescriptionsApi from "./descriptions/descriptionsApi";

class CalibrationToolApi {
  configurations;
  descriptions;

  constructor() {
    this.configurations = new ConfigurationsApi();
    this.descriptions = new DescriptionsApi();
  }
}

export default CalibrationToolApi;
