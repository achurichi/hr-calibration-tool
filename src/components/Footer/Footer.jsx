import React from "react";
import classNames from "classnames";

import Button from "components/Button/Button";

import styles from "./Footer.module.scss";

const Footer = ({ children, buttons }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.content}>{children}</div>
      {buttons && (
        <div className={styles.navigation}>
          {buttons.map(({ label, separator, ...buttonProps }) => (
            <div
              className={classNames({ [styles.separator]: separator })}
              key={label}
            >
              <Button {...buttonProps}>{label}</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Footer;
