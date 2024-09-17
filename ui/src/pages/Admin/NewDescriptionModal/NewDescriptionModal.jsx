import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";

import Button from "components/Button/Button";

const NewDescriptionModal = ({
  disabled,
  errorMessage,
  onCancel,
  onConfirm,
  show,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (show) {
      setName("");
    }
  }, [show]);

  return (
    <Modal show={show} onHide={disabled ? () => {} : onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>New description</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <Form.Control
            isInvalid={!!errorMessage}
            onChange={({ target }) => {
              setName(target.value);
            }}
            placeholder="Name"
          />
          {!!errorMessage && (
            <Form.Control.Feedback type="invalid">
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={disabled} onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            onConfirm(name);
          }}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewDescriptionModal;
