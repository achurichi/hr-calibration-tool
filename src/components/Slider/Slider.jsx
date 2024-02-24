import React from "react";
import classNames from "classnames";
import RcSlider from "rc-slider";
import { BsDashCircleFill, BsPlusCircleFill } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import "rc-slider/assets/index.css";
import "./Slider.scss";

const Slider = ({ className, ...sliderProps }) => {
  return (
    <div className={classNames(className, "slider-container")}>
      <ClickableIcon className="slider-button-container">
        <BsDashCircleFill color="var(--primary)" size={20} />
      </ClickableIcon>
      <RcSlider
        className="rc-slider"
        styles={{
          handle: {
            backgroundColor: "white",
            borderColor: "var(--primary)",
            boxShadow: "none",
            opacity: 1,
          },
          track: { backgroundColor: "var(--primary)" },
        }}
        {...sliderProps}
      />
      <ClickableIcon className="slider-button-container">
        <BsPlusCircleFill color="var(--primary)" size={20} />
      </ClickableIcon>
    </div>
  );
};

export default Slider;
