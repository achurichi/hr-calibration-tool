import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import AdvancedForm from "pages/components/Forms/AdvancedForm";
import CheckboxField from "components/FormFields/CheckboxField";
import InputField from "components/FormFields/InputField";
import PositionConfigurationForm from "pages/Admin/Forms/PositionConfigurationForm";

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
          name="name"
          registerProps={{
            required: "Name is required",
            validate: (value) => !!value.trim() || "Name is required",
          }}
          xs="6"
        />
        <InputField
          as={Col}
          controlId="formDescription"
          controlProps={{ type: "text" }}
          label="Description"
          name="description"
          xs="6"
        />
      </Row>
      <Row>
        <InputField
          as={Col}
          controlId="formGroup"
          controlProps={{ type: "text" }}
          label="Group"
          name="group"
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
          name="minValue"
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
          name="maxValue"
          registerProps={{
            required: "Maximum Value is required",
            valueAsNumber: true,
          }}
          xs="3"
        />
      </Row>
      <Row>
        <CheckboxField
          as={Col}
          controlId="formDefaultShow"
          controlProps={{
            label: "Show this motor by default for new configurations",
          }}
          name="defaultShow"
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
      <AdvancedForm collapsable={false} />
    </>
  );
};

export default MotorForm;
