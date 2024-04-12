import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react";
import debounce from "lodash/debounce";
import Select from "react-select";

import rootStore from "stores/root.store";

import { FILTER_IDS } from "constants/filters";

import SearchBar from "components/SearchBar/SearchBar";

import styles from "./MotorsFilter.module.scss";

const MotorsFilter = observer(() => {
  const { filtersStore, groupsStore } = rootStore;
  const [options, setOptions] = useState([]);

  const setSearchFilter = useRef(
    debounce((value) => {
      filtersStore.setFilter(FILTER_IDS.MOTOR_SEARCH, value);
    }, 400),
  ).current;

  useEffect(() => {
    const getGroups = async () => {
      const groups = await groupsStore.getGroups();
      setOptions(groups.map(({ _id, name }) => ({ value: _id, label: name })));
    };

    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.filter}>
      <SearchBar
        placeholder="Search by Name or Id"
        onChange={setSearchFilter}
      />
      <Select
        className={styles.select}
        isClearable
        options={options}
        placeholder="Group"
        onChange={(selectedOption) => {
          const selectedGroup = selectedOption
            ? { id: selectedOption.value, name: selectedOption.label }
            : null;
          filtersStore.setFilter(FILTER_IDS.SELECTED_GROUP, selectedGroup);
        }}
      />
    </div>
  );
});

export default MotorsFilter;
