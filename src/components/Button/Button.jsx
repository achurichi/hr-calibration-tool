import React from "react";
import ReactButton from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const DEFAULT_TOOLTIP_DELAY = { show: 250, hide: 400 };
const DEFAULT_TOOLTIP_PLACEMENT = "top";

function Button({
  children,
  tooltip,
  tooltipDelay = DEFAULT_TOOLTIP_DELAY,
  tooltipId = "",
  tooltipPlacement = DEFAULT_TOOLTIP_PLACEMENT,
  ...buttonProps
}) {
  const button = <ReactButton {...buttonProps}>{children}</ReactButton>;

  if (!tooltip) {
    return button;
  }

  return (
    <OverlayTrigger
      placement={tooltipPlacement}
      delay={tooltipDelay}
      overlay={(props) => (
        <Tooltip id={tooltipId} {...props}>
          {tooltip}
        </Tooltip>
      )}
    >
      {button}
    </OverlayTrigger>
  );
}

export default Button;
