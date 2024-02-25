import React from "react";

import { EXPRESSIONS } from "constants/expressions";
import { PATHS } from "constants/routes";

import AnimationsList from "components/AnimationsList/AnimationsList";

const Expressions = () => {
  return (
    <AnimationsList
      actionLink={PATHS.EXPRESSION_CONFIGURE}
      animations={EXPRESSIONS}
    />
  );
};

export default Expressions;
