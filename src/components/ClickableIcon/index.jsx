import React from "react";
import classNames from "classnames";

import "./ClickableIcon.scss";

const ClickableIcon = ({ children, className, onClick = () => {} }) => {
  return (
    <div className={classNames(className, "clickable")} onClick={onClick}>
      {children}
    </div>
  );
};

export default ClickableIcon;
