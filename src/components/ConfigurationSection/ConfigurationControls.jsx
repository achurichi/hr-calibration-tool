import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";

import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";

import { MOTOR_MAX_VALUE, MOTOR_MIN_VALUE } from "constants/motors";

import styles from "./ConfigurationControls.module.scss";

const CalibrationSlider = ({ defaultValue, max, min, onChange }) => {
  const [selectValue, setSelectValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setSelectValue(defaultValue);
    setInputValue(defaultValue);
  }, [defaultValue]);

  const isIntegerBetweenRange = (value, min, max) => {
    const numValue = Number(value);
    return !Number.isNaN(numValue) && numValue >= min && numValue <= max;
  };

  const internalOnChange = (value) => {
    setSelectValue(value);
    setInputValue(value);
    onChange(value);
  };

  const onSetValue = () => {
    if (!isIntegerBetweenRange(inputValue, MOTOR_MIN_VALUE, MOTOR_MAX_VALUE)) {
      // TODO: Show error message
      return;
    }
    internalOnChange(Number(inputValue));
  };

  return (
    <div className={styles.container}>
      <Slider
        className={styles.slider}
        value={selectValue}
        max={max}
        min={min}
        onChange={internalOnChange}
      />
      <div className={styles.configuration}>
        <div className={styles.actions}>
          <Form.Control
            className={styles["value-input"]}
            placeholder="Value"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSetValue();
              }
            }}
          />
          <Button onClick={onSetValue}>Set</Button>
        </div>
        <div className={styles.actions}>
          <Button tooltip="Save value in motor memeory">Save</Button>
          <Button tooltip="Copy motor current position and save in memeory">
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalibrationSlider;
