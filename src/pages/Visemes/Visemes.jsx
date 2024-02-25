import React from "react";

import { VISEMES } from "constants/visemes";
import { PATHS } from "constants/routes";

import AnimationsList from "components/AnimationsList/AnimationsList";

const Visemes = () => {
  return (
    <AnimationsList actionLink={PATHS.VISEME_CONFIGURE} animations={VISEMES} />
  );
};

export default Visemes;
