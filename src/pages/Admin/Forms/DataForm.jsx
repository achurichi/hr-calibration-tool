import React from "react";
import { observer } from "mobx-react";

import rootStore from "stores/root.store";

import { CONFIGURATIONS } from "constants/descriptions";

import MotorForm from "pages/Admin/Forms/MotorForm";
import VisemeForm from "pages/Admin/Forms/VisemeForm";
import ExpressionForm from "pages/Admin/Forms/ExpressionForm";

const DataForm = observer(() => {
  const { uiStore } = rootStore;
  const { descriptionStore: uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  let Form = null;

  switch (selectedConfiguration.value) {
    case CONFIGURATIONS.MOTORS:
      Form = MotorForm;
      break;
    case CONFIGURATIONS.VISEMES:
      Form = VisemeForm;
      break;
    case CONFIGURATIONS.EXPRESSIONS:
      Form = ExpressionForm;
      break;
    default:
      return;
  }

  return <Form />;
});

export default DataForm;
