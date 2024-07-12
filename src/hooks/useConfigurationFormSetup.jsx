import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cloneDeep from "lodash/cloneDeep";

import useCallWithNotification from "hooks/useCallWithNotification";

import { buildDefaultConfigurationForm } from "utils/forms";
import { clean, trimStrings } from "utils/object";

import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_NAME,
  ASSEMBLY,
} from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

const useConfigurationFormSetup = (
  descriptionType,
  itemType,
  itemId,
  formMethods,
) => {
  const { configurationStore, descriptionStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemDescription, setSelectedItemDescription] = useState(null);
  const itemsDescription = descriptionStore.getDescriptionItems(itemType);
  const selectedOption = uiConfigurationStore.getSelectedOption();
  const { isDirty, isValid } = formMethods.formState;

  const submitForm = async (data) => {
    trimStrings(data);
    const preparedData = clean(cloneDeep(data));
    const { success } = await callWithNotification(
      () =>
        configurationStore.saveItem(DESCRIPTION_NAME, ASSEMBLY, preparedData),
      itemType === DESCRIPTION_ITEM_TYPES.MOTOR
        ? FUNCTIONS.MOTORS_CONFIGURATION.SAVE_ITEM
        : FUNCTIONS.ANIMATIONS_CONFIGURATION.SAVE_ITEM,
      "Configuration saved",
    );

    if (success) {
      formMethods.reset(data);
    }
  };

  // load options on mount
  useEffect(() => {
    const loadOptions = async () => {
      await descriptionStore.getOrFetchDescription(
        descriptionType,
        DESCRIPTION_NAME,
      );
      const items = descriptionStore.getDescriptionItems(itemType);

      if (!items.length) {
        uiConfigurationStore.setOptions([]);
        uiConfigurationStore.setSelectedOption(null);
        return;
      }

      await configurationStore.fetchConfiguration(
        descriptionType,
        DESCRIPTION_NAME,
        ASSEMBLY,
      );

      const options = items.map(({ name, description, id }) => ({
        label: `${name}${description ? ` - ${description}` : ""}`,
        value: id,
      }));

      let itemIndex = items.findIndex((m) => m.id === itemId);
      if (itemIndex === -1) {
        itemIndex = 0;
      }

      uiConfigurationStore.setOptions(options);
      uiConfigurationStore.setSelectedOption(options[itemIndex]);
    };

    const setup = async () => {
      setIsLoading(true);
      await loadOptions();
      uiConfigurationStore.setSaveConfiguration(() => {
        const submitFn = formMethods.handleSubmit(submitForm);
        submitFn();
      });
      setIsLoading(false);
    };

    setup();

    return () => {
      configurationStore.clear();
      uiConfigurationStore.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedOption && itemsDescription) {
      const description = itemsDescription.find(
        (m) => m.id === selectedOption.value,
      );

      if (!description) {
        return;
      }

      setSelectedItemDescription(description);

      const configuredItem = configurationStore.getItem(description.id);
      formMethods.reset(); // reset with no arguments to clear values from previous item
      formMethods.reset(
        buildDefaultConfigurationForm(
          configuredItem,
          description,
          descriptionType,
        ),
      );

      let path;
      if (itemType === DESCRIPTION_ITEM_TYPES.MOTOR) {
        path = PATHS.MOTOR_CONFIGURE;
      } else if (itemType === DESCRIPTION_ITEM_TYPES.EXPRESSION) {
        path = PATHS.EXPRESSION_CONFIGURE;
      } else if (itemType === DESCRIPTION_ITEM_TYPES.VISEME) {
        path = PATHS.VISEME_CONFIGURE;
      }
      if (path) {
        navigate(`${path}/${selectedOption.value}`, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, JSON.stringify(itemsDescription)]);

  useEffect(() => {
    uiConfigurationStore.checkSaveDisabled(isLoading, isDirty, isValid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isDirty, isValid]);

  useEffect(() => {
    uiConfigurationStore.setDirtyForm(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return selectedItemDescription;
};

export default useConfigurationFormSetup;
