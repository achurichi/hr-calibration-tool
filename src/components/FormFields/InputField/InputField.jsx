import React from "react";
import { useFormContext } from "react-hook-form";

import Form from "react-bootstrap/Form";

const InputField = ({
  registerName,
  label,
  controlProps,
  registerProps,
  ...rest
}) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  // registerName may be a nested object, so we need to split by dots
  const error = registerName
    .split(".")
    .reduce((obj, key) => obj?.[key], errors);

  return (
    <Form.Group {...rest}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        {...controlProps}
        {...register(registerName, registerProps || {})}
      />
      {error && (
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default InputField;
