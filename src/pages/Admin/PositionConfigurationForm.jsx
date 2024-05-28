import React from "react";

import { Row } from "react-bootstrap";
import { LongTextField, NumField } from "pages/Admin/CustomFields";

const PositionConfigurationForm = ({ propName, title }) => {
  return (
    <>
      <div className="mb-2">
        <strong>{title}</strong>
      </div>
      <Row xs={3}>
        <NumField name={`${propName}.defaultValue`} />
      </Row>
      <LongTextField
        name={`${propName}.configDescription`}
        label="Configuration Description"
      />
    </>
  );
};

export default PositionConfigurationForm;
