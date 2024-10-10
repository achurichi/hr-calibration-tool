import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import { BsPlusLg } from 'react-icons/bs';

import styles from './Dropzone.module.scss';

const Dropzone = ({
  onAdd,
  accept,
  activeMessage = 'Drop the files here...',
  defaultMessage = 'Drag and drop files, or click to select',
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onAdd(acceptedFiles);
    },
    [onAdd]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
  });

  return (
    <div className={styles.container} {...getRootProps()}>
      <input {...getInputProps()} />
      <BsPlusLg size={30} strokeWidth={0.25} />
      <div className={styles.text}>{isDragActive ? activeMessage : defaultMessage}</div>
    </div>
  );
};

export default Dropzone;
