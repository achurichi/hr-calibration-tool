import React from "react";
import { observer } from "mobx-react";

import useDescriptionType from "pages/Admin/hooks/useDescriptionType";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

import MotorForm from "pages/Admin/Forms/MotorForm";
import AnimationForm from "pages/Admin/Forms/AnimationForm";

const DataForm = observer(() => {
  const Form = useDescriptionType({
    [DESCRIPTION_ITEM_TYPES.MOTOR]: MotorForm,
    [DESCRIPTION_ITEM_TYPES.VISEME]: AnimationForm,
    [DESCRIPTION_ITEM_TYPES.EXPRESSION]: AnimationForm,
  });

  if (!Form) {
    return null;
  }

  return <Form />;
});

export default DataForm;
