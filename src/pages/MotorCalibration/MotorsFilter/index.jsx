import React from "react";
import Select from "react-select";

import { GROUPS } from "../../../constants/motors";

import Searchbar from "../../../components/Searchbar";

import "./MotorsFilter.scss";

const MotorsFilter = () => {
  const options = Object.values(GROUPS).map((g) => ({ value: g, label: g }));

  return (
    <div className="filter">
      <Searchbar placeholder="Search by Name or Id" />
      <Select
        className="select"
        isClearable
        options={options}
        placeholder="Group"
      />
    </div>
  );
};

export default MotorsFilter;
