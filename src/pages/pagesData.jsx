import React from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "constants/routes";

import ExpressionConfiguration from "pages/Expressions/ExpressionConfiguration/ExpressionConfiguration";
import Expressions from "pages/Expressions/Expressions";
import Login from "pages/Login/Login";
import Main from "pages/Main";
import MotorCalibration from "pages/MotorCalibration/MotorCalibration";
import MotorConfiguration from "pages/MotorCalibration/MotorConfiguration/MotorConfiguration";
import VisemeConfiguration from "pages/Visemes/VisemeConfiguration/VisemeConfiguration";
import Visemes from "pages/Visemes/Visemes";

const pagesData = [
  {
    path: "/",
    element: <Main />,
    title: "main",
    routes: [
      {
        path: "",
        element: <Navigate to={PATHS.MOTORS} />,
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
        path: PATHS.VISEME_CONFIGURE,
        element: <VisemeConfiguration />,
        title: "viseme-configure",
      },
      {
        path: PATHS.EXPRESSIONS,
        element: <Expressions />,
        title: "expressions",
      },
      {
        path: PATHS.EXPRESSION_CONFIGURE,
        element: <ExpressionConfiguration />,
        title: "expression-configure",
      },
    ],
  },
  {
    path: PATHS.LOGIN,
    element: <Login />,
    title: "login",
  },
];

export default pagesData;
