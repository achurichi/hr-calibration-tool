import React from "react";
import { observer } from "mobx-react";

import rootStore from "stores/root.store";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

import MotorForm from "pages/Admin/Forms/MotorForm";
import AnimationForm from "pages/Admin/Forms/AnimationForm";

const DataForm = observer(() => {
  const { uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  let Form = null;

  switch (selectedConfiguration.value) {
    case DESCRIPTION_ITEM_TYPES.MOTOR:
      Form = MotorForm;
      break;
    case DESCRIPTION_ITEM_TYPES.VISEME:
    case DESCRIPTION_ITEM_TYPES.EXPRESSION:
      Form = AnimationForm;
      break;
    default:
      return null;
  }

  return <Form />;
});

export default DataForm;
