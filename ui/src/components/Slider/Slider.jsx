import React, { useEffect, useState } from "react";
import classNames from "classnames";
import RcSlider from "rc-slider";
import { BsDashCircleFill, BsPlusCircleFill } from "react-icons/bs";

import { countDecimals } from "@/utils/numbers";

import ClickableIcon from "@/components/ClickableIcon/ClickableIcon";

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

const dotStyle = {
  borderColor: "var(--gray-300)",
  height: 12,
  width: 12,
  bottom: -4,
};

const activeDotStyle = {
  borderColor: "var(--primary)",
};

const markStyle = {
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  msUserSelect: "none",
  pointerEvents: "none",
  userSelect: "none",
};

const Slider = ({
  className,
  max,
  min,
  onChange,
  step = 1,
  value,
  ...sliderProps
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const internalOnChange = (value) => {
    let parsedValue = Number(value.toFixed(countDecimals(step))); // to avoid floating point issues
    if (parsedValue >= min && parsedValue <= max) {
      setInternalValue(parsedValue);
      onChange(parsedValue);
    }
  };

  return (
    <div className={classNames(styles.container, className)}>
      <ClickableIcon
        Icon={BsDashCircleFill}
        className={styles["clickable-button"]}
        color="var(--primary)"
        onClick={() => internalOnChange(internalValue - step)}
        size={20}
      />
      <RcSlider
        activeDotStyle={activeDotStyle}
        className={styles.slider}
        dotStyle={dotStyle}
        marks={{
          [min]: { style: markStyle, label: min },
          [max]: { style: markStyle, label: max },
        }}
        max={max}
        min={min}
        onChange={internalOnChange}
        step={step}
        styles={sliderStyles}
        value={internalValue}
        {...sliderProps}
      />
      <ClickableIcon
        Icon={BsPlusCircleFill}
        className={styles["clickable-button"]}
        color="var(--primary)"
        onClick={() => internalOnChange(internalValue + step)}
        size={20}
      />
    </div>
  );
};

export default Slider;
