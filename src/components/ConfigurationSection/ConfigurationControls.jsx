import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";

import "./ConfigurationControls.scss";

const DEFAULT_SLIDER_VALUE = 2048;

const CalibrationSlider = () => {
  const [sliderValue, setSliderValue] = useState(DEFAULT_SLIDER_VALUE);

  return (
    <div className="calibration-slider-container">
      <Slider
        className="calibration-slider"
        defaultValue={DEFAULT_SLIDER_VALUE}
        max={4096}
        min={0}
        onChange={setSliderValue}
      />
      <div className="calibration-configuration-container">
        <div className="calibration-actions-container">
          <Form.Control
            className="motor-value-input"
            placeholder="Value"
            value={sliderValue}
          />
          <Button>Set</Button>
        </div>
        <div className="calibration-actions-container">
          <Button tooltip="Save value in motor memeory">Save</Button>
          <Button tooltip="Copy current motor position and save in memeory">
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationSlider;
