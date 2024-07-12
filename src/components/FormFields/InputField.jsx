import React from "react";
import { useFormContext } from "react-hook-form";

import Form from "react-bootstrap/Form";

import { getError } from "utils/forms";

const InputField = ({ controlProps, label, name, registerProps, ...rest }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = getError(name, errors);

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
