import React from "react";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

import AnimationConfiguration from "pages/Animations/components/AnimationConfiguration/AnimationConfiguration";

const VisemeConfiguration = () => {
  return (
    <AnimationConfiguration animationType={DESCRIPTION_ITEM_TYPES.VISEME} />
  );
};

export default VisemeConfiguration;
