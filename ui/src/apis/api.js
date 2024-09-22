import CalibrationToolApi from "./calibrationTool/calibrationToolApi";

class Api {
  rootStore;
  calibrationTool;

  constructor(root) {
    this.rootStore = root;
    this.calibrationTool = new CalibrationToolApi();
  }
}

export default Api;
