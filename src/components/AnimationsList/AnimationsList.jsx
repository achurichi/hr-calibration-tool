import React from "react";
import { useNavigate } from "react-router-dom";

import { BsPencil } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "components/Table/Table";

import styles from "./AnimationsList.module.scss";

const TABLE_HEADERS = [
  { key: "id", label: "Id", className: styles["id-column"] },
  { key: "name", label: "Name" },
  { key: "action", label: "", className: styles["action-column"] },
];

const AnimationsList = ({ animations, actionLink }) => {
  const navigate = useNavigate();

  const rows = animations.map((item) => {
    return {
      ...item,
      action: (
        <ClickableIcon>
          <BsPencil onClick={() => navigate(actionLink)} />
        </ClickableIcon>
      ),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <SearchBar placeholder="Search by Name or Id" />
        <Table headers={TABLE_HEADERS} hover rows={rows} />
      </div>
    </div>
  );
};

export default AnimationsList;
