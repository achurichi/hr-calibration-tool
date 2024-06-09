import React from "react";
import ReactButton from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { DEFAULT_TOOLTIP_PROPS } from "constants/tooltips";

function Button({
  children,
  tooltipProps = DEFAULT_TOOLTIP_PROPS,
  ...buttonProps
}) {
  const tooltipConfig = { ...DEFAULT_TOOLTIP_PROPS, ...tooltipProps };
  const button = <ReactButton {...buttonProps}>{children}</ReactButton>;

  if (!tooltipConfig.content) {
    return button;
  }

  return (
    <OverlayTrigger
      placement={tooltipConfig.placement}
      delay={tooltipConfig.delay}
      overlay={(props) => (
        <Tooltip id={tooltipConfig.id} {...props}>
          {tooltipConfig.content}
        </Tooltip>
      )}
    >
      {button}
    </OverlayTrigger>
  );
}

export default Button;
