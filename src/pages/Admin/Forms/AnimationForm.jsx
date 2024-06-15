import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputField from "components/FormFields/InputField/InputField";
import ImageFieldArray from "pages/Admin/Forms/ImageFieldArray";
import MotionFieldArray from "pages/Admin/Forms/MotionFieldArray";

const AnimationForm = () => {
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
          registerProps={{
            required: "Name is required",
            validate: (value) => !!value.trim() || "Name is required",
          }}
        />
      </Row>
      <Row>
        <InputField
          as={Col}
          controlId="formconfigInstructions"
          controlProps={{ as: "textarea" }}
          label="Configuration Instructions"
          registerName="configInstructions"
        />
      </Row>
      <Row>
        <ImageFieldArray name="images" />
      </Row>
      <Row xs="12">
        <MotionFieldArray name="motions" />
      </Row>
    </>
  );
};

export default AnimationForm;
