import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import Select from "react-select";

import { FILTER_IDS } from "@/constants/filters";

import SearchBar from "@/components/SearchBar/SearchBar";

import rootStore from "@/stores/root.store";

import styles from "./MotorsFilter.module.scss";

const MotorsFilter = observer(({ motors }) => {
  const { filtersStore, robotStore } = rootStore;
  const [assemblyOptions, setAssemblyOptions] = useState([]);
  const [groupOptions, setGroupOptions] = useState([]);

  useEffect(() => {
    if (!motors) {
      return;
    }

    const groupOptions = Array.from(new Set(motors.map(({ group }) => group)))
      .filter(Boolean) // Remove empty groups
      .map((group) => ({ value: group, label: group }));
    setGroupOptions(groupOptions);

    const assemblyOptions = robotStore
      .getAssemblyIds()
      .map((id) => ({ value: id, label: id }));
    setAssemblyOptions(assemblyOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motors]);

  return (
    <div className={styles.filter}>
      <SearchBar
        placeholder="Search by Name or Id"
        onChange={(value) => {
          filtersStore.setFilter(FILTER_IDS.MOTOR_SEARCH, value);
        }}
      />
      <Select
        isClearable
        options={groupOptions}
        placeholder="Group"
        onChange={(selectedOption) => {
          filtersStore.setFilter(
            FILTER_IDS.SELECTED_GROUP,
            selectedOption?.value || null,
          );
        }}
      />
      <Select
        isClearable
        options={assemblyOptions}
        placeholder="Assembly"
        onChange={(selectedOption) => {
          filtersStore.setFilter(
            FILTER_IDS.SELECTED_ASSEMBLY,
            selectedOption?.value || null,
          );
        }}
      />
    </div>
  );
});

export default MotorsFilter;
