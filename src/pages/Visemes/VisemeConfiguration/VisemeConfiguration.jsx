import React from "react";

import { VISEMES } from "constants/visemes";

import AnimationConfiguration from "components/AnimationConfiguration/AnimationConfiguration";

const VisemeConfiguration = () => {
  return <AnimationConfiguration animations={VISEMES} />;
};

export default VisemeConfiguration;
