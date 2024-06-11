import React from "react";

import AnimationsList from "pages/Animations/AnimationsList/AnimationsList";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";
import { PATHS } from "constants/routes";

const Visemes = () => {
  return (
    <AnimationsList
      actionLink={PATHS.VISEME_CONFIGURE}
      descriptionItemType={DESCRIPTION_ITEM_TYPES.VISEME}
    />
  );
};

export default Visemes;
