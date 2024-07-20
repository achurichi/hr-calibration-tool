import { useEffect, useState } from "react";

import rootStore from "stores/root.store";

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
        const itemWithAssembly = {
          ...item,
          assembly: robotStore.getAssemblyByDescriptionName(description.name),
        };

        // if the item is present in the configuration store, it is configurable, otherwise it is an option to add
        if (configurationStore.getItem(item.id)) {
          toConfigure.push(itemWithAssembly);
        } else {
          toAdd.push(itemWithAssembly);
        }
      });

      allToConfigure.push(...toConfigure);
      allToAdd.push(...toAdd);
    });

    setItems({ configure: allToConfigure, add: allToAdd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptions, JSON.stringify(configurationStore.getAllIds())]);

  return items;
};

export default useConfigurableItems;
