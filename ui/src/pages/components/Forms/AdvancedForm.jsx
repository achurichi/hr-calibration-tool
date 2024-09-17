import React, { useState } from "react";
import classNames from "classnames";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import InputField from "components/FormFields/InputField";

import { getExtraProps } from "./utils";

import styles from "./AdvancedForm.module.scss";

const ADVANCED_PROPS = [
  { name: "motor_id", type: "number" },
  { name: "sort_no", type: "number" },
  { name: "speed", type: "number" },
  { name: "acceleration", type: "number" },
  { name: "torque", type: "number" },
  { name: "hardware", type: "text" },
  { name: "transmission", type: "text" },
  { name: "topic", type: "text" },
];

const ADVANCED_MAPPING_PROPS = [
  { name: "lin_min", type: "number" },
  { name: "lin_max", type: "number" },
  { name: "imax1", type: "number" },
  { name: "max1", type: "number" },
  { name: "imax2", type: "number" },
  { name: "max2", type: "number" },
  { name: "parser", type: "text" },
  { name: "parser_param", type: "text" },
  { name: "function", type: "text" },
  { name: "other_func", type: "text", as: "textarea" },
];

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
        {ADVANCED_PROPS.map(({ name, ...controlProps }) => (
          <InputField
            as={Col}
            controlId={`form-advanced-${name}`}
            controlProps={controlProps}
            key={name}
            label={name}
            name={name}
            registerProps={{ valueAsNumber: controlProps.type === "number" }}
            xs="4"
            {...getExtraProps(controlProps)}
          />
        ))}
        <div className="mt-2 mb-1 fw-bold">Mapping</div>
        {ADVANCED_MAPPING_PROPS.map(({ name, ...controlProps }) => {
          const isTextArea = controlProps.as === "textarea";
          return (
            <InputField
              className={classNames({ [styles["textarea-input"]]: isTextArea })}
              as={Col}
              controlId={`form-advanced-${name}`}
              controlProps={controlProps}
              key={name}
              label={name}
              name={`mapping.${name}`}
              xs={isTextArea ? "12" : "4"}
              {...getExtraProps(controlProps)}
            />
          );
        })}
      </Row>
    </div>
  );
};

export default AdvancedForm;
