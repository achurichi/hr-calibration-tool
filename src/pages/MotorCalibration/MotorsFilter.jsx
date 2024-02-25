import React from "react";
import Select from "react-select";

import { GROUPS } from "constants/motors";

import SearchBar from "components/SearchBar/SearchBar";

import styles from "./MotorsFilter.module.scss";

const MotorsFilter = () => {
  const options = Object.values(GROUPS).map((g) => ({ value: g, label: g }));

  return (
    <div className={styles.filter}>
      <SearchBar placeholder="Search by Name or Id" />
      <Select
        className={styles.select}
        isClearable
        options={options}
        placeholder="Group"
      />
    </div>
  );
};

export default MotorsFilter;
