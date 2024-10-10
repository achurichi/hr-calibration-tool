import { useFormContext } from 'react-hook-form';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputField from '@/components/FormFields/InputField';

const MotionForm = ({ index, name }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const motionName = `${name}.${index}`;

  const checkIsInvalid = (field) => {
    return !!errors[name]?.[index]?.value?.[field];
  };

  return (
    <Col>
      <Row className="mb-3">
        <InputField
          as={Col}
          controlId={`form-${motionName}-name`}
          controlProps={{
            type: 'text',
            isInvalid: checkIsInvalid('name'),
          }}
          label="Name"
          registerProps={{
            required: 'Name is required',
            validate: (value) => !!value.trim() || 'Name is required',
          }}
          name={`${motionName}.value.name`}
          xs="6"
        />
        <InputField
          as={Col}
          controlId={`form-${motionName}-description`}
          controlProps={{
            type: 'text',
            isInvalid: checkIsInvalid('description'),
          }}
          label="Description"
          registerProps={{
            required: 'Description is required',
            validate: (value) => !!value.trim() || 'Description is required',
          }}
          name={`${motionName}.value.description`}
          xs="6"
        />
      </Row>
      <Row>
        <InputField
          as={Col}
          controlId={`form-${motionName}-minValue`}
          controlProps={{
            isInvalid: checkIsInvalid('minValue'),
            step: '0.1',
            type: 'number',
          }}
          label="Minimum Value"
          registerProps={{
            required: 'Minimum Value is required',
            valueAsNumber: true,
          }}
          name={`${motionName}.value.minValue`}
          xs="4"
        />
        <InputField
          as={Col}
          controlId={`form-${motionName}-maxValue`}
          controlProps={{
            isInvalid: checkIsInvalid('maxValue'),
            step: '0.1',
            type: 'number',
          }}
          label="Maximum Value"
          registerProps={{
            required: 'Maximum Value is required',
            valueAsNumber: true,
          }}
          name={`${motionName}.value.maxValue`}
          xs="4"
        />
        <InputField
          as={Col}
          controlId={`form-${motionName}-defaultValue`}
          controlProps={{
            isInvalid: checkIsInvalid('defaultValue'),
            step: '0.1',
            type: 'number',
          }}
          label="Default Value"
          registerProps={{
            required: 'Default Value is required',
            valueAsNumber: true,
          }}
          name={`${motionName}.value.defaultValue`}
          xs="4"
        />
      </Row>
    </Col>
  );
};

export default MotionForm;
