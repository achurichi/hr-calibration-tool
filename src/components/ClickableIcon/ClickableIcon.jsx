import React from "react";
import classNames from "classnames";

import styles from "./ClickableIcon.module.scss";

const ClickableIcon = ({ children, className, onClick = () => {} }) => {
  return (
    <div className={classNames(className, styles.clickable)} onClick={onClick}>
      {children}
    </div>
  );
};

export default ClickableIcon;
