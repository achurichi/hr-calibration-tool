import React from "react";

import MotorsFilter from "./MotorsFilter";
import MotorsTable from "./MotorsTable";

import "./MotorCalibration.scss";

const MotorCalibration = () => {
  return (
    <div className="container">
      <div className="internal-container">
        <MotorsFilter />
        <MotorsTable />
      </div>
    </div>
  );
};

export default MotorCalibration;
