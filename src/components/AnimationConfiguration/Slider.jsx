import React, { useState } from "react";

import Form from "react-bootstrap/Form";

import SliderComponent from "components/Slider/Slider";

import styles from "./Slider.module.scss";

const DEFAULT_SLIDER_VALUE = 2048;

const Slider = ({ name }) => {
  const [sliderValue, setSliderValue] = useState(DEFAULT_SLIDER_VALUE);

  return (
    <div className={styles.container}>
      <div className={styles.name}>{name}</div>
      <SliderComponent
        className={styles.slider}
        defaultValue={DEFAULT_SLIDER_VALUE}
        max={4095}
        min={0}
        onChange={setSliderValue}
      />
      <Form.Control
        className={styles["value-input"]}
        placeholder="Value"
        value={sliderValue}
        onChange={() => {}}
      />
    </div>
  );
};

export default Slider;
