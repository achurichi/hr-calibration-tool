import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import Card from "react-bootstrap/Card";
import {
  BsArrowDownCircleFill,
  BsArrowUpCircleFill,
  BsPlusLg,
  BsXLg,
} from "react-icons/bs";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import Button from "components/Button/Button";

import MotionForm from "pages/Admin/Forms/MotionForm";

import { DEFAULT_MOTION_FORM } from "constants/forms";

import styles from "./MotionFieldArray.module.scss";

const MotionFieldArray = ({ name }) => {
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name,
  });

  return (
    <>
      <div className="mb-2">
        <div>Motions</div>
      </div>
      <div className={styles.container}>
        {fields.map((field, index) => {
          const isFirst = index === 0;
          const isLast = index === fields.length - 1;
          return (
            <div className={styles["field-container"]} key={field.id}>
              <Card className={styles.card}>
                <Card.Title className={styles.title}>
                  <div>{`Motion ${index + 1}`}</div>
                  <ClickableIcon
                    Icon={BsXLg}
                    iconClassName={styles["remove-icon"]}
                    onClick={() => remove(index)}
                    size={20}
                    disabled={fields.length === 1}
                  />
                </Card.Title>
                <Card.Body className={styles.body}>
                  <MotionForm index={index} name={name} />
                </Card.Body>
              </Card>
              <div className={styles.move}>
                <ClickableIcon
                  Icon={BsArrowUpCircleFill}
                  onClick={() => move(index, index - 1)}
                  size={20}
                  disabled={isFirst}
                />
                <ClickableIcon
                  Icon={BsArrowDownCircleFill}
                  onClick={() => move(index, index + 1)}
                  size={20}
                  disabled={isLast}
                />
              </div>
            </div>
          );
        })}
        <div>
          <Button
            className={styles["add-button"]}
            onClick={() => append({ value: DEFAULT_MOTION_FORM })}
            variant="outline-primary"
          >
            <BsPlusLg />
            Add Motion
          </Button>
        </div>
      </div>
    </>
  );
};

export default MotionFieldArray;
