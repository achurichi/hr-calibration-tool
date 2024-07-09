import React, { useState } from "react";
import classNames from "classnames";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import InputField from "components/FormFields/InputField/InputField";

import { DEFAULT_ADVANCED_FORM } from "constants/forms";

import styles from "./AdvancedForm.module.scss";

const AdvancedForm = ({ collapsable = true }) => {
  const [collapsed, setCollapsed] = useState(true);

  const title = <div className="mt-2 mb-1 fw-bold">Advanced Properties</div>;
  const header = collapsable ? (
    <div
      className={styles.collapsable}
      onClick={() => setCollapsed(!collapsed)}
    >
      {title}
      <ClickableIcon Icon={collapsed ? BsChevronDown : BsChevronUp} size={18} />
    </div>
  ) : (
    title
  );

  return (
    <div>
      {header}
      <Row
        className={classNames(styles.content, {
          [styles.collapsed]: collapsable && collapsed,
        })}
      >
        {Object.keys(DEFAULT_ADVANCED_FORM).map((prop) => (
          <InputField
            as={Col}
            controlId={`form-advanced-${prop}`}
            controlProps={{ type: "text" }}
            key={prop}
            label={prop}
            name={`advanced.${prop}`}
            xs="4"
          />
        ))}
      </Row>
    </div>
  );
};

export default AdvancedForm;
