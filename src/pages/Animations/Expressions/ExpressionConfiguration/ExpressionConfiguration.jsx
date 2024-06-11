import React from "react";

import { EXPRESSIONS } from "constants/expressions";

import AnimationConfiguration from "components/AnimationConfiguration/AnimationConfiguration";

const ExpressionConfiguration = () => {
  return <AnimationConfiguration animations={EXPRESSIONS} />;
};

export default ExpressionConfiguration;
