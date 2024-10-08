import { useFormContext } from 'react-hook-form';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputField from '@/components/FormFields/InputField';
import ImageFieldArray from '@/pages/Admin/Forms/ImageFieldArray';

import styles from './PositionConfigurationForm.module.scss';

const PositionConfigurationForm = ({ propName, title }) => {
  const {
    formState: { errors },
  } = useFormContext();
  const defaultValueProp = `${propName}.defaultValue`;
  const configInstructionsProp = `${propName}.configInstructions`;
  const imagesProp = `${propName}.images`;

  return (
    <div>
      <div className="mt-2 mb-1 fw-bold">{title}</div>
      <Row className={styles.row}>
        <InputField
          as={Col}
          controlId={`form-${defaultValueProp}`}
          controlProps={{
            type: 'number',
            isInvalid: !!errors[propName]?.defaultValue,
          }}
          label="Default Value"
          name={defaultValueProp}
          registerProps={{
            required: 'Default Value is required',
            valueAsNumber: true,
          }}
          xs="3"
        />
        <InputField
          as={Col}
          controlId={`form-${configInstructionsProp}`}
          controlProps={{ as: 'textarea' }}
          label="Configuration Instructions"
          name={configInstructionsProp}
          xs="12"
        />
        <Col>
          <ImageFieldArray name={imagesProp} />
        </Col>
      </Row>
    </div>
  );
};

export default PositionConfigurationForm;
