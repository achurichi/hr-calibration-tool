import React from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "../constants/routes";

import Main from "./Main";
import MotorCalibration from "./MotorCalibration";
import Visemes from "./Visemes";
import Expressions from "./Expressions";

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
