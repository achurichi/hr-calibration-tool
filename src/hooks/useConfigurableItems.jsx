import { useEffect, useState } from "react";

import rootStore from "stores/root.store";

const useConfigurableItems = (descriptionType) => {
  const { descriptionStore, robotStore } = rootStore;
  const [items, setItems] = useState([]);

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

    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(robotStore.getAssemblyIds())]);

  return items;
};

export default useConfigurableItems;
