import React from "react";

import AnimationCalibration from "pages/Animations/components/AnimationCalibration/AnimationCalibration";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";
import { PATHS } from "constants/routes";

const Expressions = () => {
  return (
    <AnimationCalibration
      actionLink={PATHS.EXPRESSION_CONFIGURE}
      descriptionItemType={DESCRIPTION_ITEM_TYPES.EXPRESSION}
    />
  );
};

export default Expressions;
