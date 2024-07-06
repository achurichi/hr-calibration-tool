import React, { forwardRef } from "react";
import ReactButton from "react-bootstrap/Button";

import Tooltip from "components/Tooltip/Tooltip";

import { DEFAULT_TOOLTIP_PROPS } from "constants/tooltips";

const Button = forwardRef(
  ({ children, tooltipProps = DEFAULT_TOOLTIP_PROPS, ...buttonProps }, ref) => {
    const tooltipConfig = { ...DEFAULT_TOOLTIP_PROPS, ...tooltipProps };

    return (
      <Tooltip
        content={tooltipConfig.content}
        delay={tooltipConfig.delay}
        id={tooltipConfig.id}
        placement={tooltipConfig.placement}
        wrap
      >
        <ReactButton ref={ref} {...buttonProps}>
          {children}
        </ReactButton>
      </Tooltip>
    );
  },
);

export default Button;
