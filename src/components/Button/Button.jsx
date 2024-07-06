import React from "react";
import ReactButton from "react-bootstrap/Button";

import Tooltip from "components/Tooltip/Tooltip";

import { DEFAULT_TOOLTIP_PROPS } from "constants/tooltips";

function Button({
  children,
  tooltipProps = DEFAULT_TOOLTIP_PROPS,
  ...buttonProps
}) {
  const tooltipConfig = { ...DEFAULT_TOOLTIP_PROPS, ...tooltipProps };

  return (
    <Tooltip
      content={tooltipConfig.content}
      delay={tooltipConfig.delay}
      id={tooltipConfig.id}
      placement={tooltipConfig.placement}
      wrap
    >
      <ReactButton {...buttonProps}>{children}</ReactButton>
    </Tooltip>
  );
}

export default Button;
