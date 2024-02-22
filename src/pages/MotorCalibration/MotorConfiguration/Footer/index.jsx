import React from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import ProgressBar from "components/ProgressBar";

import "./Footer.scss";

const Footer = () => {
  return (
    <div className="motor-config-footer">
      <div className="motor-status">
        <Form className="motor-footer-form">
          <Form.Check
            type="checkbox"
            id="enable-torque"
            label="Enable torque"
          />
        </Form>
        <ProgressBar
          containerClassName="motor-current-position"
          now={50}
          showCurrentValue
          topLabel="Motor current position"
        />
        <ProgressBar
          containerClassName="motor-load"
          now={50}
          topLabel="Motor load"
        />
      </div>
      <div className="motor-config-navigation">
        <Button className="motor-config-navigation-button">
          Previous motor
        </Button>
        <Button className="nowrap">Next motor</Button>
      </div>
    </div>
  );
};

export default Footer;
