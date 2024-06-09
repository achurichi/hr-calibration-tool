import React from "react";
import classNames from "classnames";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
      {!!tooltipConfig.content && (
        <OverlayTrigger
          placement={tooltipConfig.placement}
          delay={tooltipConfig.delay}
          overlay={(props) => (
            <Tooltip id={tooltipConfig.id} {...props}>
              {tooltipConfig.content}
            </Tooltip>
          )}
        >
          <span>{icon}</span>
        </OverlayTrigger>
      )}
      {!tooltipConfig.content && icon}
    </div>
  );
};

export default ClickableIcon;
