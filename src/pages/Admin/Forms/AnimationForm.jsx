import React from "react";

import { TextField } from "pages/Admin/CustomFields";

import { Col, Row } from "react-bootstrap";

const AnimationForm = () => {
  return (
    <Row>
      <Col>
        <TextField name="name" />
      </Col>
      <Col>
        <TextField name="configDescription" label="Configuration Description" />
      </Col>
    </Row>
  );
};

export default AnimationForm;
