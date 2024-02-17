import React from "react";
import { useNavigate } from "react-router-dom";

import { BsPencil } from "react-icons/bs";

import { MOTORS } from "constants/motors";
import { PATHS } from "constants/routes";

import ClickableIcon from "components/ClickableIcon";
import Table from "components/Table";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";

import "./MotorCalibration.scss";

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
    <div className="container">
      <div className="internal-container">
        <MotorsFilter />
        <Table headers={TABLE_HEADERS} hover rows={rows} />
      </div>
    </div>
  );
};

export default MotorCalibration;
