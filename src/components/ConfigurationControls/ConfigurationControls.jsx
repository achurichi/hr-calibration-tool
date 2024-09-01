import React, { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Button from "components/Button/Button";
import Slider from "components/Slider/Slider";
import Tooltip from "components/Tooltip/Tooltip";

import {
  getLimitValue,
  validateRange,
} from "components/ConfigurationControls/utils";
import { getError } from "utils/forms";

import styles from "./ConfigurationControls.module.scss";

const ConfigurationControls = ({
  className,
  configurationId,
  extraButtons,
  inline = false,
  max,
  maxAllowed,
  min,
  minAllowed,
  name,
  step = 1,
  title,
}) => {
  const {
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useFormContext();
  const enterKeyPressed = useRef(false);
  const setButtonRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [inputValue, setInputValue] = useState(0);
  const [showSetButton, setShowSetButton] = useState(false);
  const value = watch(name);
  const error = getError(name, errors);

  useEffect(() => {
    if (validateRange(value, min, max, minAllowed, maxAllowed) === true) {
      // only update input and slider if the value is valid
      setInputValue(value);
      setSliderValue(value);
    }
  }, [value, configurationId, min, max, minAllowed, maxAllowed]);

  const onSetValue = () => {
    const numValue = inputValue === "" ? null : Number(inputValue);
    if (value === numValue) {
      setShowSetButton(false);
      return;
    }
    setValue(name, numValue, { shouldDirty: true });
    trigger();
    setShowSetButton(false);
  };

  return (
    <div
      className={classNames(
        styles.container,
        { [styles["container-inline"]]: inline },
        className,
      )}
    >
      {title && (
        <div
          className={classNames(styles.title, {
            [styles["title-inline"]]: inline,
          })}
        >
          {title}
        </div>
      )}
      <Slider
        className={classNames(styles.slider, {
          [styles["slider-inline"]]: inline,
        })}
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
        step={step}
      />
      <div className={styles.configuration}>
        <Form.Group
          as={Col}
          className={styles["form-group"]}
          controlId={`form-${name}`}
        >
          <InputGroup className={styles["input-group"]}>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Tooltip
                  content={inline && error?.message}
                  id={`tooltip-input-${name}`}
                >
                  <Form.Control
                    {...field}
                    className={styles.input}
                    isInvalid={!!error}
                    onBlur={(e) => {
                      field.onBlur(e);
                      // if the set button was clicked or enter was pressed, don't reset the value
                      if (
                        setButtonRef.current?.contains(e.relatedTarget) ||
                        enterKeyPressed.current
                      ) {
                        enterKeyPressed.current = false;
                        return;
                      }
                      setInputValue(value);
                      setShowSetButton(false);
                    }}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setShowSetButton(true)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSetValue();
                        enterKeyPressed.current = true;
                        e.target.blur();
                      }
                    }}
                    step={step}
                    type="number"
                    value={inputValue}
                  />
                </Tooltip>
              )}
              rules={{
                required: "Value is required",
                validate: (value) =>
                  validateRange(value, min, max, minAllowed, maxAllowed),
                valueAsNumber: true,
              }}
            />
            {showSetButton && (
              <Button onClick={onSetValue} ref={setButtonRef}>
                Set
              </Button>
            )}
          </InputGroup>
          {extraButtons &&
            extraButtons.map(({ label, ...buttonProps }) => (
              <Button key={label} {...buttonProps}>
                {label}
              </Button>
            ))}
        </Form.Group>
        {!!error?.message && !inline && (
          <div className={classNames("text-danger", styles.feedback)}>
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigurationControls;
