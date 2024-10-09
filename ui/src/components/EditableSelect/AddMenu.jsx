import React from "react";

import { BsPlusLg } from "react-icons/bs";
import { components } from "react-select";

import Button from "@/components/Button/Button";

import styles from "./AddMenu.module.scss";

const AddMenu = ({ selectRef, ...props }) => {
  return (
    <components.Menu {...props}>
      <div>
        <div>{props.children}</div>
        <Button
          Icon={BsPlusLg}
          className={styles.menu}
          onClick={(e) => {
            selectRef?.current?.blur();
            props.selectProps.onAdd(e);
          }}
          variant="outline-primary"
        >
          Add
        </Button>
      </div>
    </components.Menu>
  );
};

export default AddMenu;
