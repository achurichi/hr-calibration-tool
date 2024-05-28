import React from "react";

import { NumField, TextField } from "pages/Admin/CustomFields";

import { Col, Row } from "react-bootstrap";

import PositionConfigurationForm from "pages/Admin/PositionConfigurationForm";

const MotorForm = () => {
  return (
    <>
      <Row>
        <Col>
          <TextField name="name" />
        </Col>
        <Col>
          <TextField name="group" />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <TextField name="description" />
        </Col>
        <Col>
          <NumField name="minValue" />
        </Col>
        <Col>
          <NumField name="maxValue" />
        </Col>
      </Row>
      <PositionConfigurationForm
        title="Neutral Position"
        propName="neutralPosition"
      />
      <PositionConfigurationForm
        title="Minimum Position"
        propName="minPosition"
      />
      <PositionConfigurationForm
        title="Maximum Position"
        propName="maxPosition"
      />
    </>
  );
};

export default MotorForm;
