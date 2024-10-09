import React from "react";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ReactTooltip from "react-bootstrap/Tooltip";

import { DEFAULT_TOOLTIP_DELAY } from "@/constants/tooltips";

const Tooltip = ({
  children,
  content,
  delay = DEFAULT_TOOLTIP_DELAY,
  id,
  placement = "top",
  show,
  wrap = false, // some components need to be wrapped in a span in order to show the tooltip
}) => {
  if (!content) {
    return children;
  }

  return (
    <OverlayTrigger
      placement={placement}
      delay={delay}
      overlay={(props) => (
        <ReactTooltip id={id} {...props}>
          {content}
        </ReactTooltip>
      )}
      show={show}
    >
      {wrap ? <span>{children}</span> : children}
    </OverlayTrigger>
  );
};

export default Tooltip;
