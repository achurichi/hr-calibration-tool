import React from "react";

import { LongTextField as UniformLongTextField } from "uniforms-bootstrap5";

import CustomInput from "pages/Admin/CustomFields/CustomInput";

const LongTextField = (props) => {
  return <CustomInput Component={UniformLongTextField} {...props} />;
};

export default LongTextField;
