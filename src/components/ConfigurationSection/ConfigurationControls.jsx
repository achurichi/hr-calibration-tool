import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";

import styles from "./ConfigurationControls.module.scss";

const DEFAULT_SLIDER_VALUE = 2048;

const CalibrationSlider = () => {
  const [sliderValue, setSliderValue] = useState(DEFAULT_SLIDER_VALUE);

  return (
    <div className={styles.container}>
      <Slider
        className={styles.slider}
        defaultValue={DEFAULT_SLIDER_VALUE}
        max={4096}
        min={0}
        onChange={setSliderValue}
      />
      <div className={styles.configuration}>
        <div className={styles.actions}>
          <Form.Control
            className={styles["value-input"]}
            placeholder="Value"
            value={sliderValue}
          />
          <Button>Set</Button>
        </div>
        <div className={styles.actions}>
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
