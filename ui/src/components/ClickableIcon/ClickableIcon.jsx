import React from "react";
import classNames from "classnames";

import Tooltip from "components/Tooltip/Tooltip";

import { DEFAULT_TOOLTIP_PROPS } from "constants/tooltips";

import styles from "./ClickableIcon.module.scss";

const ClickableIcon = ({
  Icon,
  children,
  className,
  disabled = false,
  iconClassName,
  onClick = () => {},
  tooltipProps = DEFAULT_TOOLTIP_PROPS,
  ...rest
}) => {
  const tooltipConfig = { ...DEFAULT_TOOLTIP_PROPS, ...tooltipProps };
  const icon = (
    <Icon
      className={classNames(
        {
          [styles.disabled]: disabled,
        },
        iconClassName,
      )}
      {...rest}
    />
  );

  return (
    <div
      className={classNames(className, {
        [styles.clickable]: !disabled,
      })}
      onClick={disabled ? () => {} : onClick}
    >
      <Tooltip
        content={tooltipConfig.content}
        delay={tooltipConfig.delay}
        id={tooltipConfig.id}
        placement={tooltipConfig.placement}
        wrap
      >
        {icon}
      </Tooltip>
    </div>
  );
};

export default ClickableIcon;
