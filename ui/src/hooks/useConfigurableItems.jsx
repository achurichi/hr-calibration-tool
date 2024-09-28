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
  const [configurations, setConfigurations] = useState([]);
  const [items, setItems] = useState({ configure: [], add: [] });
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    const getItems = async () => {
      const descriptions =
        await descriptionStore.getOrFetchAssemblyDescriptions(descriptionType);
      const configurations =
        await configurationStore.getOrFetchAssemblyConfigurations(
          descriptionType,
          true,
        );

      setDescriptions(descriptions);
      setConfigurations(configurations);
    };

    if (!missingConfigurations) {
      getItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missingConfigurations, JSON.stringify(robotStore.getAssemblyIds())]);

  useEffect(() => {
    if (!configurations.length) {
      return;
    }

    const allToConfigure = [];
    const allToAdd = [];

    configurations.forEach((configuration) => {
      if (!configuration?.[descriptionType]) {
        return;
      }

      // items to configure
      const toConfigure = configuration[descriptionType].map((item) => {
        return descriptionType === DESCRIPTION_TYPES.MOTORS
          ? {
              id: item.descId,
              name: item.motorName,
              motorId: item.motor_id,
              min: item.minPositionValue,
              max: item.maxPositionValue,
              neutral: item.neutralPositionValue,
              group: item.group,
              assembly: configuration.assembly,
              sortNo: item.sort_no,
            }
          : {
              id: item.descId,
              name: item.animationName,
              type: item.animationType,
            };
      });

      allToConfigure.push(...toConfigure);

      // only motors allow adding new items
      if (descriptionType !== DESCRIPTION_TYPES.MOTORS) {
        return;
      }

      // items to add
      const description = descriptions.find(
        (desc) => desc.name === configuration.descriptionName,
      );

      if (!description?.[descriptionType]) {
        return;
      }

      const toAdd = [];
      description[descriptionType].forEach((item) => {
        if (toConfigure.some((conf) => conf.id === item.id)) {
          return;
        }
        toAdd.push({
          id: item.id,
          name: item.name,
          assembly: robotStore.getAssemblyByDescriptionName(description.name),
          sortNo: item.sort_no,
        });
      });

      allToAdd.push(...toAdd);
    });

    allToConfigure.sort(sortFn);
    allToAdd.sort(sortFn);

    setItems({ configure: allToConfigure, add: allToAdd });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    configurations,
    descriptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(configurationStore.getAllIds()),
  ]);

  return items;
};

export default useConfigurableItems;
