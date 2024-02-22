import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import Slider from "components/Slider";

import "./ConfigurationControls.scss";

const CalibrationSlider = () => {
  return (
    <div className="calibration-slider-container">
      <Slider className="calibration-slider" />
      <div className="calibration-configuration-container">
        <div className="calibration-actions-container">
          <Form.Control className="motor-value-input" placeholder="Value" />
          <Button>Set</Button>
        </div>
        <div className="calibration-actions-container">
          <Button>Save</Button>
          <Button>Copy</Button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationSlider;
