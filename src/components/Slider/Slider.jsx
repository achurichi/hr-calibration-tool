import React, { useEffect, useState } from "react";
import classNames from "classnames";
import RcSlider from "rc-slider";
import { BsDashCircleFill, BsPlusCircleFill } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import "rc-slider/assets/index.css";
import styles from "./Slider.module.scss";

const sliderStyles = {
  handle: {
    backgroundColor: "white",
    borderColor: "var(--primary)",
    boxShadow: "none",
    height: 20,
    marginTop: -8,
    opacity: 1,
    width: 20,
  },
  track: {
    backgroundColor: "var(--primary)",
  },
};

const Slider = ({ className, max, min, value, onChange, ...sliderProps }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const internalOnChange = (value) => {
    if (value >= min && value <= max) {
      setInternalValue(value);
      onChange(value);
    }
  };

  return (
    <div className={classNames(className, styles.container)}>
      <ClickableIcon
        className={styles["clickable-button"]}
        onClick={() => internalOnChange(internalValue - 1)}
      >
        <BsDashCircleFill color="var(--primary)" size={20} />
      </ClickableIcon>
      <RcSlider
        className={styles.slider}
        max={max}
        min={min}
        onChange={internalOnChange}
        styles={sliderStyles}
        value={internalValue}
        {...sliderProps}
      />
      <ClickableIcon
        className={styles["clickable-button"]}
        onClick={() => internalOnChange(internalValue + 1)}
      >
        <BsPlusCircleFill color="var(--primary)" size={20} />
      </ClickableIcon>
    </div>
  );
};

export default Slider;
