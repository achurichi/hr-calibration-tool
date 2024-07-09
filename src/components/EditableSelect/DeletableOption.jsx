import React from "react";

import { BsTrash } from "react-icons/bs";
import { components } from "react-select";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import styles from "./DeletableOption.module.scss";

const DeletableOption = (props) => {
  return (
    <components.Option {...props}>
      <div className={styles.label}>
        <span>{props.children}</span>
        <ClickableIcon
          Icon={BsTrash}
          iconClassName={styles.delete}
          onClick={(e) => {
            e.stopPropagation();
            props.selectProps.onDelete({
              label: props.label,
              value: props.value,
            });
          }}
          tooltipProps={{ content: "Delete", id: "delete-icon" }}
        />
      </div>
    </components.Option>
  );
};

export default DeletableOption;
