import React from "react";

import AnimationsList from "pages/Animations/components/AnimationsList/AnimationsList";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";
import { PATHS } from "constants/routes";

const Expressions = () => {
  return (
    <AnimationsList
      actionLink={PATHS.EXPRESSION_CONFIGURE}
      descriptionItemType={DESCRIPTION_ITEM_TYPES.EXPRESSION}
    />
  );
};

export default Expressions;
