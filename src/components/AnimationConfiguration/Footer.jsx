import React from "react";

import Form from "react-bootstrap/Form";

import FooterComponent from "components/Footer/Footer";
import ProgressBar from "components/ProgressBar/ProgressBar";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <FooterComponent
    // primaryButton={{ label: "Save" }}
    // secondaryButton={{ label: "Reset" }}
    >
      <Form className={styles.form}>
        <Form.Check
          type="checkbox"
          id="preview-robot"
          label="Preview on the robot"
        />
      </Form>
      <ProgressBar
        containerClassName={styles["motor-load"]}
        now={50}
        topLabel="Motor load"
      />
    </FooterComponent>
  );
};

export default Footer;
