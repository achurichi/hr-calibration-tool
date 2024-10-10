import { useEffect, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import Button from '@/components/Button/Button';
import EmptyField from '@/components/Table/EmptyField/EmptyField';
import Table from '@/components/Table/Table';

import styles from './AddMotorsModal.module.scss';

const TABLE_HEADERS = [
  { key: 'add' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'assembly', label: 'Assembly' },
];

const AddMotorsModal = ({ disabled, motors, onCancel, onConfirm, show }) => {
  const [selectedMotors, setSelectedMotors] = useState([]);
  const someSelected = !!selectedMotors.length;

  useEffect(() => {
    if (show) {
      setSelectedMotors([]);
    }
  }, [show]);

  const renderCheckbox = (motor) => (
    <Form.Check
      className={styles.checkbox}
      id={`motor-${motor.id}`}
      label={motor.label}
      onChange={({ target }) => {
        setSelectedMotors(
          target.checked ? (prev) => [...prev, motor] : (prev) => prev.filter((item) => item.id !== motor.id)
        );
      }}
      type="checkbox"
    />
  );

  const rows = motors.map((motor) => ({
    add: renderCheckbox(motor),
    name: motor.name,
    description: motor.description || <EmptyField text="No description" />,
    assembly: motor.assembly,
  }));

  const onAddClick = () => {
    let assemblies = selectedMotors.map(({ assembly }) => assembly);
    assemblies = [...new Set(assemblies)];
    const motorsByAssembly = {};
    assemblies.forEach((assembly) => {
      motors = selectedMotors.filter((m) => m.assembly === assembly).map((m) => m.id);
      if (motors.length) {
        motorsByAssembly[assembly] = motors;
      }
    });
    onConfirm(motorsByAssembly);
  };

  return (
    <Modal show={show} onHide={disabled ? () => {} : onCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add motors</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.body}>
        <Table bordered={false} headers={TABLE_HEADERS} rows={rows} />
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={disabled} onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button
          disabled={disabled || !someSelected}
          onClick={onAddClick}
          tooltipProps={{
            content: !someSelected && 'Select at least one motor',
          }}
        >
          {someSelected ? `Add (${selectedMotors.length})` : 'Add'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddMotorsModal;
