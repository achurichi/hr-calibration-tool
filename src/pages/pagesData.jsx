import React from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "constants/routes";

import Expressions from "pages/Expressions/Expressions";
import Main from "pages/Main";
import MotorCalibration from "pages/MotorCalibration/MotorCalibration";
import MotorConfiguration from "pages/MotorCalibration/MotorConfiguration/MotorConfiguration";
import Visemes from "pages/Visemes/Visemes";

const pagesData = [
  {
    path: "",
    element: <Main />,
    title: "main",
    routes: [
      {
        path: "",
        element: <Navigate to="/motors" />,
        title: "motor-calibration-redirect",
      },
      {
        path: PATHS.MOTORS,
        element: <MotorCalibration />,
        title: "motor-calibration",
      },
      {
        path: PATHS.MOTOR_CONFIGURE,
        element: <MotorConfiguration />,
        title: "motor-configure",
      },
      {
        path: PATHS.VISEMES,
        element: <Visemes />,
        title: "visemes",
      },
      {
        path: PATHS.EXPRESSIONS,
        element: <Expressions />,
        title: "expressions",
      },
    ],
  },
];

export default pagesData;
