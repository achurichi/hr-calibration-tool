import { useEffect, useState } from "react";

import rootStore from "stores/root.store";

const useConfigurableItems = (descriptionType) => {
  const { configurationStore, descriptionStore, robotStore } = rootStore;
  const [items, setItems] = useState([]);
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    const getItems = async () => {
      const descriptions =
        await descriptionStore.getOrFetchAssemblyDescriptions(descriptionType);
      await configurationStore.getOrFetchAssemblyConfigurations(
        descriptionType,
        true,
      );

      const items = [];
      descriptions.forEach((description) => {
        if (description?.[descriptionType]) {
          const itemsWithAssembly = [];
          description[descriptionType].forEach((item) => {
            // don't add items that don't have a configuration
            if (!configurationStore.getItem(item.id)) {
              return;
            }

            itemsWithAssembly.push({
              ...item,
              assembly: robotStore.getAssemblyByDescriptionName(
                description.name,
              ),
            });
          });
          items.push(...itemsWithAssembly);
        }
      });

      setItems(items);
    };

    if (!missingConfigurations) {
      getItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigurations, JSON.stringify(robotStore.getAssemblyIds())]);

  return items;
};

export default useConfigurableItems;
