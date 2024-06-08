import React from "react";

import Modal from "react-bootstrap/Modal";

import Button from "components/Button/Button";

const ConfirmationModal = ({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
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
        <Button disabled={disabled} variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button disabled={disabled} variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
