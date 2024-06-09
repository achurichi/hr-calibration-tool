import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputField from "pages/Admin/Forms/InputField";
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
          controlId="formConfigDescription"
          controlProps={{ as: "textarea" }}
          label="Configuration Description"
          registerName="configDescription"
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
