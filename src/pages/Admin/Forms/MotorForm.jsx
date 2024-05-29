import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputField from "pages/Admin/Forms/InputField";

import PositionConfigurationForm from "pages/Admin/PositionConfigurationForm";

const MotorForm = () => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Row>
        <InputField
          as={Col}
          controlId="formName"
          controlProps={{ type: "text", isInvalid: !!errors.name }}
          label="Name"
          registerName="name"
          registerProps={{ required: "Name is required" }}
          xs="6"
        />
        <InputField
          as={Col}
          controlId="formGroup"
          controlProps={{ type: "text" }}
          label="Group"
          registerName="group"
          xs="6"
        />
      </Row>
      <Row>
        <InputField
          as={Col}
          controlId="formDescription"
          controlProps={{ type: "text" }}
          label="Description"
          registerName="description"
          xs="6"
        />
        <InputField
          as={Col}
          controlId="formMinValue"
          controlProps={{
            type: "number",
            isInvalid: !!errors.minValue,
          }}
          label="Minimum Value"
          registerName="minValue"
          registerProps={{
            required: "Minimum Value is required",
            valueAsNumber: true,
          }}
          xs="3"
        />
        <InputField
          as={Col}
          controlId="formMaxValue"
          controlProps={{
            type: "number",
            isInvalid: !!errors.maxValue,
          }}
          label="Maximum Value"
          registerName="maxValue"
          registerProps={{
            required: "Maximum Value is required",
            valueAsNumber: true,
          }}
          xs="3"
        />
      </Row>
      <PositionConfigurationForm
        propName="neutralPosition"
        title="Neutral Position"
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
