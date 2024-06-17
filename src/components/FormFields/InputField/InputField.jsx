import React from "react";
import { useFormContext } from "react-hook-form";

import Form from "react-bootstrap/Form";

const InputField = ({ controlProps, label, name, registerProps, ...rest }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  // name prop may come from a nested object, so we need to split by dots
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors);

  return (
    <Form.Group {...rest}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        {...controlProps}
        {...register(name, registerProps || {})}
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
