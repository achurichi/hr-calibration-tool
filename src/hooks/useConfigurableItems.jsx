import { useEffect, useState } from "react";

import rootStore from "stores/root.store";

const useConfigurableItems = (descriptionType) => {
  const { descriptionStore, robotStore } = rootStore;
  const [items, setItems] = useState([]);
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    const getItems = async () => {
      const descriptions =
        await descriptionStore.getOrFetchAssemblyDescriptions(descriptionType);

      const items = [];
      descriptions.forEach((description) => {
        if (description?.[descriptionType]) {
          const itemsWithAssembly = description[descriptionType].map(
            (item) => ({
              ...item,
              assembly: robotStore.getAssemblyByDescriptionName(
                description.name,
              ),
            }),
          );
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
