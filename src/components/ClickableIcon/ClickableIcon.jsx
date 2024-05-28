import React from "react";
import classNames from "classnames";

import styles from "./ClickableIcon.module.scss";

const ClickableIcon = ({
  Icon,
  children,
  className,
  disabled = false,
  iconClassName,
  onClick = () => {},
  ...rest
}) => {
  return (
    <div
      className={classNames(className, {
        [styles.clickable]: !disabled,
      })}
      onClick={disabled ? () => {} : onClick}
    >
      <Icon
        className={classNames(
          {
            [styles.disabled]: disabled,
          },
          iconClassName,
        )}
        {...rest}
      />
    </div>
  );
};

export default ClickableIcon;
