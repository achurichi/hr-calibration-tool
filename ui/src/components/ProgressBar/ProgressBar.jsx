import classNames from 'classnames';

import ReactProgressBar from 'react-bootstrap/ProgressBar';

import styles from './ProgressBar.module.scss';

const ProgressBar = ({ className, containerClassName, showCurrentValue, topLabel, ...props }) => {
  return (
    <div className={containerClassName}>
      <div>{topLabel}</div>
      <div className={styles['progress-wrapper']}>
        <ReactProgressBar className={classNames(styles.progress, className)} {...props} />
        {showCurrentValue && <div className={styles.value}>{props.now}</div>}
      </div>
    </div>
  );
};

export default ProgressBar;
