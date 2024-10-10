import Modal from 'react-bootstrap/Modal';

import Button from '@/components/Button/Button';

const ConfirmationModal = ({
  cancelLabel = 'Cancel',
  cancelVariant = 'secondary',
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  disabled,
  message,
  onCancel,
  onConfirm,
  show,
  title,
}) => {
  return (
    <Modal show={show} onHide={disabled ? () => {} : onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button disabled={disabled} onClick={onCancel} variant={cancelVariant}>
          {cancelLabel}
        </Button>
        <Button disabled={disabled} onClick={onConfirm} variant={confirmVariant}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
