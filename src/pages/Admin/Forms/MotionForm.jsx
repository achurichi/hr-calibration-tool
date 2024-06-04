import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputField from "pages/Admin/Forms/InputField";

const MotionForm = ({ index, name }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const motionName = `${name}.${index}`;

  return (
    <Col>
      <Row className="mb-3">
        <InputField
          as={Col}
          controlId={`${motionName}.value.name`}
          controlProps={{
            type: "text",
            isInvalid: !!errors[name]?.[index]?.value?.name,
          }}
          label="Name"
          registerProps={{ required: "Name is required" }}
          registerName={`${motionName}.value.name`}
          xs="6"
        />
        <InputField
          as={Col}
          controlId={`${motionName}.value.description`}
          controlProps={{ type: "text" }}
          label="Description"
          registerName={`${motionName}.value.description`}
          xs="6"
        />
      </Row>
      <Row>
        <InputField
          as={Col}
          controlId={`${motionName}.value.minValue`}
          controlProps={{
            type: "number",
            isInvalid: !!errors[name]?.[index]?.value?.minValue,
          }}
          label="Minimum Value"
          registerProps={{ required: "Minimum Value is required" }}
          registerName={`${motionName}.value.minValue`}
          xs="4"
        />
        <InputField
          as={Col}
          controlId={`${motionName}.value.maxValue`}
          controlProps={{
            type: "number",
            isInvalid: !!errors[name]?.[index]?.value?.maxValue,
          }}
          label="Maximum Value"
          registerProps={{ required: "Maximum Value is required" }}
          registerName={`${motionName}.value.maxValue`}
          xs="4"
        />
        <InputField
          as={Col}
          controlId={`${motionName}.value.defaultValue`}
          controlProps={{
            type: "number",
            isInvalid: !!errors[name]?.[index]?.value?.defaultValue,
          }}
          label="Default Value"
          registerProps={{ required: "Default Value is required" }}
          registerName={`${motionName}.value.defaultValue`}
          xs="4"
        />
      </Row>
    </Col>
  );
};

export default MotionForm;
