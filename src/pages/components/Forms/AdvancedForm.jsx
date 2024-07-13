import React, { useState } from "react";
import classNames from "classnames";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import InputField from "components/FormFields/InputField";

import {
  DEFAULT_ADVANCED_FORM,
  DEFAULT_ADVANCED_MAPPING_FORM,
} from "constants/forms";

import styles from "./AdvancedForm.module.scss";

const ADVANCED_PROPS = Object.keys(DEFAULT_ADVANCED_FORM);
const ADVANCED_MAPPING_PROPS = Object.keys(DEFAULT_ADVANCED_MAPPING_FORM);

const AdvancedForm = ({ collapsable = true }) => {
  const [collapsed, setCollapsed] = useState(true);

  const title = <div className="mt-2 mb-1 fw-bold">Advanced Properties</div>;
  const header = collapsable ? (
    <div
      className={styles["collapsable-header"]}
      onClick={() => setCollapsed(!collapsed)}
    >
      <ClickableIcon Icon={collapsed ? BsChevronDown : BsChevronUp} size={18} />
      {title}
    </div>
  ) : (
    title
  );

  return (
    <div>
      {header}
      <Row
        className={classNames(styles.content, {
          [styles.collapsable]: collapsable,
          [styles.collapsed]: collapsable && collapsed,
        })}
      >
        {ADVANCED_PROPS.map((prop) => (
          <InputField
            as={Col}
            controlId={`form-advanced-${prop}`}
            controlProps={{ type: "text" }}
            key={prop}
            label={prop}
            name={prop}
            xs="4"
          />
        ))}
        <div className="mt-2 mb-1 fw-bold">Mapping</div>
        {ADVANCED_MAPPING_PROPS.map((prop) => (
          <InputField
            as={Col}
            controlId={`form-advanced-${prop}`}
            controlProps={{ type: "text" }}
            key={prop}
            label={prop}
            name={`mapping.${prop}`}
            xs="4"
          />
        ))}
      </Row>
    </div>
  );
};

export default AdvancedForm;
