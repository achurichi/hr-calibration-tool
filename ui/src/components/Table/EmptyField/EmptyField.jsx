import styles from './EmptyField.module.scss';

const EmptyField = ({ text = 'Empty' }) => {
  return <div className={styles.empty}>{text}</div>;
};

export default EmptyField;
