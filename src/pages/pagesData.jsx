import React from "react";
import { Navigate } from "react-router-dom";

import MotorCalibration from "./MotorCalibration";
import Visemes from "./Visemes";
import Expressions from "./Expressions";

const pagesData = [
  {
    path: "",
    element: <Navigate to="motors" />,
    title: "home",
  },
  {
    path: "motors",
    element: <MotorCalibration />,
    title: "motor-calibration",
  },
  {
    path: "visemes",
    element: <Visemes />,
    title: "visemes",
  },
  {
    path: "expressions",
    element: <Expressions />,
    title: "expressions",
  },
];

export default pagesData;
