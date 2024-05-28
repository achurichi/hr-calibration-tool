import React from "react";

import { TextField as UniformTextField } from "uniforms-bootstrap5";

import CustomInput from "pages/Admin/CustomFields/CustomInput";

const TextField = (props) => {
  return <CustomInput Component={UniformTextField} {...props} />;
};

export default TextField;
