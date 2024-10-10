import { useFormContext } from 'react-hook-form';

import Form from 'react-bootstrap/Form';

import Tooltip from '@/components/Tooltip/Tooltip';

import { getError } from '@/utils/forms';

const CheckboxField = ({ controlProps, info, name, registerProps, ...rest }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = getError(name, errors);

  return (
    <Form.Group {...rest}>
      <div className="d-flex">
        <Tooltip content={info} id={`tooltip-${name}`} wrap>
          <Form.Check type="checkbox" {...controlProps} {...register(name, registerProps || {})} />
        </Tooltip>
      </div>
      {error && <Form.Control.Feedback type="invalid">{error?.message}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default CheckboxField;
