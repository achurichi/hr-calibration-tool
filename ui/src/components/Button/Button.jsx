import { forwardRef } from 'react';
import classNames from 'classnames';

import ReactButton from 'react-bootstrap/Button';

import Tooltip from '@/components/Tooltip/Tooltip';

import { DEFAULT_TOOLTIP_PROPS } from '@/constants/tooltips';

import styles from './Button.module.scss';

const Button = forwardRef(({ Icon, children, tooltipProps = DEFAULT_TOOLTIP_PROPS, ...buttonProps }, ref) => {
  const tooltipConfig = { ...DEFAULT_TOOLTIP_PROPS, ...tooltipProps };

  return (
    <Tooltip
      content={tooltipConfig.content}
      delay={tooltipConfig.delay}
      id={tooltipConfig.id}
      placement={tooltipConfig.placement}
      wrap
    >
      <ReactButton ref={ref} {...buttonProps} className={classNames({ [styles.icon]: !!Icon }, buttonProps.className)}>
        {Icon && <Icon />}
        {children}
      </ReactButton>
    </Tooltip>
  );
});

export default Button;
