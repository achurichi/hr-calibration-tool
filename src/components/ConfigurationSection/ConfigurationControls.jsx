import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";

import {
  getLimitValue,
  validateRange,
} from "components/ConfigurationSection/utils";

import styles from "./ConfigurationControls.module.scss";

const ConfigurationControls = ({
  className,
  configurationId,
  extraButtons,
  max,
  maxAllowed,
  min,
  minAllowed,
  name,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext();
  const [sliderValue, setSliderValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const value = watch(name);

  useEffect(() => {
    if (validateRange(value, min, max, minAllowed, maxAllowed) === true) {
      // only update input and slider if the value is valid
      setInputValue(value);
      setSliderValue(value);
    }
  }, [value, configurationId, min, max, minAllowed, maxAllowed]);

  const onSetValue = () => {
    const numValue = inputValue === "" ? null : Number(inputValue);
    setValue(name, numValue, { shouldDirty: true });
    trigger();
  };

  return (
    <div className={classNames(styles.container, className)}>
      <Slider
        className={styles.slider}
        value={sliderValue}
        max={getLimitValue(max, minAllowed, maxAllowed)}
        min={getLimitValue(min, minAllowed, maxAllowed)}
        onChange={(value) => {
          setSliderValue(value);
          setInputValue(value);
          setValue(name, value, { shouldDirty: true });
        }}
        onChangeComplete={() => {
          trigger(); // trigger validation to clear previous errors if any
        }}
      />
      <div className={styles.configuration}>
        <div className={styles.actions}>
          <Form.Group as={Col} controlId={`form-${name}`} xs="5">
            <Controller
              control={control}
              name={name}
              render={({ field: { ref } }) => (
                <Form.Control
                  className={styles.input}
                  isInvalid={!!errors[name]}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSetValue();
                    }
                  }}
                  ref={ref}
                  type="number"
                  value={inputValue}
                />
              )}
              rules={{
                required: "Value is required",
                validate: (value) =>
                  validateRange(value, min, max, minAllowed, maxAllowed),
                valueAsNumber: true,
              }}
            />
            {errors[name] && (
              <Form.Control.Feedback className={styles.feedback} type="invalid">
                {errors[name]?.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Button onClick={onSetValue}>Set</Button>
          {extraButtons &&
            extraButtons.map(({ label, ...buttonProps }) => (
              <Button key={label} {...buttonProps}>
                {label}
              </Button>
            ))}
        </div>
        <div className={styles.actions}></div>
      </div>
    </div>
  );
};

export default ConfigurationControls;
