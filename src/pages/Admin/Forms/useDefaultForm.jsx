import rootStore from "stores/root.store";

import { DESCRIPTION_ITEM_TYPES } from "constants/descriptions";

import {
  DEFAULT_EXPRESSION_FORM,
  DEFAULT_MOTOR_FORM,
  DEFAULT_VISEME_FORM,
} from "constants/forms";

const useDefaultForm = () => {
  const { uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();

  switch (selectedConfiguration.value) {
    case DESCRIPTION_ITEM_TYPES.MOTOR:
      return DEFAULT_MOTOR_FORM;
    case DESCRIPTION_ITEM_TYPES.VISEME:
      return DEFAULT_VISEME_FORM;
    case DESCRIPTION_ITEM_TYPES.EXPRESSION:
      return DEFAULT_EXPRESSION_FORM;
    default:
      return null;
  }
};

export default useDefaultForm;
