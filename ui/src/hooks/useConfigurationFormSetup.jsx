import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cloneDeep from 'lodash/cloneDeep';

import useCallWithNotification from '@/hooks/useCallWithNotification';

import { buildDefaultConfigurationForm } from '@/utils/forms';
import { clean, trimStrings } from '@/utils/object';

import { DESCRIPTION_ITEM_TYPES } from '@/constants/descriptions';
import { REQUEST_IDS as MOTORS_CONFIGURATIONS_REQUESTS } from '@/apis/calibrationTool/configurations/motors/motorsApi';
import { PATHS } from '@/constants/routes';

import rootStore from '@/stores/root.store';

const useConfigurationFormSetup = (descriptionType, itemType, itemId, formMethods) => {
  const { configurationStore, descriptionStore, robotStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItemDescription, setSelectedItemDescription] = useState(null);
  const selectedOption = uiConfigurationStore.getSelectedOption();
  const { isDirty, isValid } = formMethods.formState;
  const itemsDescription = descriptionStore.getAssemblyDescriptionItems(itemType);
  const itemsDescriptionSignature = JSON.stringify(itemsDescription);
  const configurationKeysSignature = JSON.stringify(configurationStore.getConfigurationKeys());
  const [nameChanged, setNameChanged] = useState(false);

  const submitForm = async (data) => {
    // not using itemId because it may be outdated for this function
    const selectedId = uiConfigurationStore.getSelectedOption().value;
    const descriptionName = descriptionStore.getDescriptionNameByItemId(selectedId, descriptionType);
    const assemblyId = robotStore.getAssemblyByDescriptionName(descriptionName);
    trimStrings(data);
    const preparedData = clean(cloneDeep(data));
    const { success } = await callWithNotification(
      () => configurationStore.saveItem(descriptionType, descriptionName, assemblyId, preparedData),
      MOTORS_CONFIGURATIONS_REQUESTS.SAVE_CONFIGURATION_ITEM, // is the same that ANIMATIONS_CONFIGURATIONS_REQUESTS.SAVE_CONFIGURATION_ITEM
      'Configuration saved'
    );

    if (success) {
      formMethods.reset(data);
      loadOptions(); // reload options in case the configuration was saved with a new name
    }
  };

  const loadOptions = async () => {
    await descriptionStore.getOrFetchAssemblyDescriptions(descriptionType);
    const items = descriptionStore.getAssemblyDescriptionItems(itemType);

    if (!items.length) {
      uiConfigurationStore.setOptions([]);
      uiConfigurationStore.setSelectedOption(null);
      return;
    }

    await configurationStore.getOrFetchAssemblyConfigurations(descriptionType);

    const options = [];
    items.forEach(({ description, id }) => {
      const configItem = configurationStore.getItem(id);
      // don't add items that don't have a configuration
      if (!configItem) {
        return;
      }

      const name = configItem[configurationStore.getNameKey(descriptionType)];
      const descriptionLabel = description && description !== '-' ? description : '';
      options.push({
        label: `${name}${descriptionLabel}`,
        value: id,
      });
    });

    let optionIndex = options.findIndex((o) => o.value === itemId);
    if (optionIndex === -1) {
      optionIndex = 0;
    }

    uiConfigurationStore.setOptions(options);
    uiConfigurationStore.setSelectedOption(options[optionIndex]);
  };

  // load options on mount
  useEffect(() => {
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
      const description = itemsDescription.find((i) => i.id === selectedOption.value);

      if (!description) {
        return;
      }

      setSelectedItemDescription(description);

      const configuredItem = configurationStore.getItem(description.id);
      formMethods.reset(); // reset with no arguments to clear values from previous item

      if (configuredItem) {
        formMethods.reset(buildDefaultConfigurationForm(configuredItem, descriptionType));

        const nameKey = configurationStore.getNameKey(descriptionType);
        const configurationName = configuredItem[nameKey];
        const descriptionName = description.name;

        if (!!configurationName && descriptionName !== configurationName) {
          formMethods.setValue(nameKey, descriptionName, {
            shouldDirty: true,
          });
          setNameChanged(true); // adding a flag to check if the name was changed because isDirty is not being updated
        } else {
          setNameChanged(false);
        }
      }

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
  }, [selectedOption, itemsDescriptionSignature, configurationKeysSignature, formMethods]);

  useEffect(() => {
    uiConfigurationStore.checkSaveDisabled(isLoading, isDirty, isValid, nameChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isDirty, isValid, nameChanged]);

  useEffect(() => {
    uiConfigurationStore.setDirtyForm(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return selectedItemDescription;
};

export default useConfigurationFormSetup;
