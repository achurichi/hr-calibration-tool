import React from "react";
import { useNavigate } from "react-router-dom";

import { BsPencil } from "react-icons/bs";

import { EXPRESSIONS } from "constants/expressions";
import { PATHS } from "constants/routes";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "components/Table/Table";

import styles from "./Expressions.module.scss";

const TABLE_HEADERS = { id: "Id", name: "Name", action: "" };

const Expressions = () => {
  const navigate = useNavigate();

  const rows = EXPRESSIONS.map((item) => {
    return {
      ...item,
      action: (
        <ClickableIcon>
          <BsPencil onClick={() => navigate(PATHS.EXPRESSION_CONFIGURE)} />
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

export default Expressions;
