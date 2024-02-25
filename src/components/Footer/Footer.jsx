import React from "react";

import Button from "components/Button/Button";

import styles from "./Footer.module.scss";

const Footer = ({ children, primaryButton, secondaryButton }) => {
  return (
    <div className={styles.footer}>
      <div className={styles.content}>{children}</div>
      <div className={styles.navigation}>
        {secondaryButton && (
          <Button onClick={secondaryButton.onClick}>
            {secondaryButton.label}
          </Button>
        )}
        {primaryButton && (
          <Button onClick={primaryButton.onClick}>{primaryButton.label}</Button>
        )}
      </div>
    </div>
  );
};

export default Footer;
