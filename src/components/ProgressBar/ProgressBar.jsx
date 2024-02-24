import React from "react";
import classNames from "classnames";

import ReactProgressBar from "react-bootstrap/ProgressBar";

import "./ProgressBar.scss";

const ProgressBar = ({
  className,
  containerClassName,
  showCurrentValue,
  topLabel,
  ...props
}) => {
  return (
    <div className={containerClassName}>
      <div>{topLabel}</div>
      <div className="progress-container-bottom">
        <ReactProgressBar
          className={classNames("progress-bar-with-label", className)}
          {...props}
        />
        {showCurrentValue && <div className="progress-value">2048</div>}
      </div>
    </div>
  );
};

export default ProgressBar;
