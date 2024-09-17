import React from "react";

import { BsTrash } from "react-icons/bs";
import { components } from "react-select";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import styles from "./DeletableOption.module.scss";

const DeletableOption = (props) => {
  return (
    <components.Option {...props} className={styles.option}>
      <div className={styles.container}>
        <span className={styles.label}>{props.children}</span>
        <ClickableIcon
          className={styles.delete}
          Icon={BsTrash}
          iconClassName={styles.icon}
          onClick={(e) => {
            e.stopPropagation();
            props.selectProps.onDelete({
              label: props.label,
              value: props.value,
            });
          }}
        />
      </div>
    </components.Option>
  );
};

export default DeletableOption;
