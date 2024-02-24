import React from "react";
import { useNavigate } from "react-router-dom";

import { BsPencil } from "react-icons/bs";

import { MOTORS } from "constants/motors";
import { PATHS } from "constants/routes";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import Table from "components/Table/Table";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";

import styles from "./MotorCalibration.module.scss";

const TABLE_HEADERS = { id: "Id", name: "Name", group: "Group", action: "" };

const MotorCalibration = () => {
  const navigate = useNavigate();

  const rows = MOTORS.map((item) => {
    return {
      ...item,
      action: (
        <ClickableIcon>
          <BsPencil onClick={() => navigate(PATHS.MOTOR_CONFIGURE)} />
        </ClickableIcon>
      ),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <MotorsFilter />
        <Table headers={TABLE_HEADERS} hover rows={rows} />
      </div>
    </div>
  );
};

export default MotorCalibration;
