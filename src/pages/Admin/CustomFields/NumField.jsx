import React from "react";

import { NumField as UniformNumField } from "uniforms-bootstrap5";

import CustomInput from "pages/Admin/CustomFields/CustomInput";

const NumField = (props) => {
  return <CustomInput Component={UniformNumField} {...props} />;
};

export default NumField;
