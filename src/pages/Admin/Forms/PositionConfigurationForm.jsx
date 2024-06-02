import React from "react";
import { useFormContext } from "react-hook-form";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputField from "pages/Admin/Forms/InputField";
import ImageFieldArray from "pages/Admin/Forms/ImageFieldArray";

import styles from "./PositionConfigurationForm.module.scss";

const PositionConfigurationForm = ({ propName, title }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const defaultValueProp = `${propName}.defaultValue`;
  const configDescriptionProp = `${propName}.configDescription`;
  const imagesProp = `${propName}.images`;

  return (
    <>
      <div className="mt-2">
        <strong>{title}</strong>
      </div>
      <Row className={styles.row}>
        <InputField
          as={Col}
          controlId={`form-${defaultValueProp}`}
          controlProps={{
            type: "number",
            isInvalid: !!errors[propName]?.defaultValue,
          }}
          label="Default Value"
          registerName={defaultValueProp}
          registerProps={{
            required: "Default Value is required",
            valueAsNumber: true,
          }}
          xs="3"
        />
        <InputField
          as={Col}
          controlId={`form-${configDescriptionProp}`}
          controlProps={{ as: "textarea" }}
          label="Configuration Description"
          registerName={configDescriptionProp}
          xs="12"
        />
        <Col>
          <ImageFieldArray name={imagesProp} />
        </Col>
      </Row>
    </>
  );
};

export default PositionConfigurationForm;
