import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import Select from "react-select";

import rootStore from "stores/root.store";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FILTER_IDS } from "constants/filters";

import SearchBar from "components/SearchBar/SearchBar";

import styles from "./MotorsFilter.module.scss";

const MotorsFilter = observer(() => {
  const { descriptionStore, filtersStore } = rootStore;
  const [options, setOptions] = useState([]);
  const description = descriptionStore.getDescription(DESCRIPTION_TYPES.MOTORS);

  useEffect(() => {
    if (!description?.motors) {
      return;
    }

    const groupOptions = Array.from(
      new Set(description.motors.map(({ group }) => group)),
    )
      .filter(Boolean) // Remove empty groups
      .map((group) => ({ value: group, label: group }));

    setOptions(groupOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description]);

  return (
    <div className={styles.filter}>
      <SearchBar
        placeholder="Search by Name or Description"
        onChange={(value) => {
          filtersStore.setFilter(FILTER_IDS.MOTOR_SEARCH, value);
        }}
      />
      <Select
        className={styles.select}
        isClearable
        options={options}
        placeholder="Group"
        onChange={(selectedOption) => {
          filtersStore.setFilter(
            FILTER_IDS.SELECTED_GROUP,
            selectedOption?.value || null,
          );
        }}
      />
    </div>
  );
});

export default MotorsFilter;
