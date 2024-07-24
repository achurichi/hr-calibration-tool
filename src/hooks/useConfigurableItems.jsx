import { useEffect, useState } from "react";

import { DESCRIPTION_TYPES } from "constants/descriptions";

import rootStore from "stores/root.store";

const sortFn = (a, b) => {
  const aIsNumber = !isNaN(a.sortNo);
  const bIsNumber = !isNaN(b.sortNo);

  if (aIsNumber && bIsNumber) {
    return Number(a.sortNo) - Number(b.sortNo);
  }
  if (aIsNumber) {
    return -1;
  }
  if (bIsNumber) {
    return 1;
  }
  return 0;
};

const useConfigurableItems = (descriptionType) => {
  const { configurationStore, descriptionStore, robotStore } = rootStore;
  const [descriptions, setDescriptions] = useState([]);
  const [items, setItems] = useState({ configure: [], add: [] });
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    const getItems = async () => {
      const descriptions =
        await descriptionStore.getOrFetchAssemblyDescriptions(descriptionType);
      await configurationStore.getOrFetchAssemblyConfigurations(
        descriptionType,
        true,
      );

      setDescriptions(descriptions);
    };

    if (!missingConfigurations) {
      getItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigurations, JSON.stringify(robotStore.getAssemblyIds())]);

  useEffect(() => {
    if (!descriptions.length) {
      return;
    }

    const allToConfigure = [];
    const allToAdd = [];

    descriptions.forEach((description) => {
      if (!description?.[descriptionType]) {
        return;
      }

      const toConfigure = [];
      const toAdd = [];

      description[descriptionType].forEach((item) => {
        const itemWithAssembly =
          descriptionType === DESCRIPTION_TYPES.MOTORS
            ? {
                id: item.id,
                name: item.name,
                description: item.description,
                group: item.group,
                assembly: robotStore.getAssemblyByDescriptionName(
                  description.name,
                ),
                sortNo: item.sort_no,
              }
            : {
                id: item.id,
                name: item.name,
                type: item.type,
              };

        // if the item is present in the configuration store, it is configurable, otherwise it is an option to add
        const configItem = configurationStore.getItem(item.id);
        if (configItem) {
          toConfigure.push({
            ...itemWithAssembly,
            sortNo: configItem.sort_no, // use the sort_no from the configuration that may have been changed
          });
        } else {
          toAdd.push(itemWithAssembly);
        }
      });

      allToConfigure.push(...toConfigure);
      allToAdd.push(...toAdd);
    });

    allToConfigure.sort(sortFn);
    allToAdd.sort(sortFn);

    setItems({ configure: allToConfigure, add: allToAdd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptions, JSON.stringify(configurationStore.getAllIds())]);

  return items;
};

export default useConfigurableItems;
