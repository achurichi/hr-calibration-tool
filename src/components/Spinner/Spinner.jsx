import React from "react";
import classNames from "classnames";

import ReactSpinner from "react-bootstrap/Spinner";

import styles from "./Spinner.module.scss";

const Spinner = ({ className, ...spinnerProps }) => {
  return (
    <div className={classNames(styles.container, className)}>
      <ReactSpinner variant="primary" {...spinnerProps} />
    </div>
  );
};

export default Spinner;
