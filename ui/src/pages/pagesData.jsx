import React from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "@/constants/routes";

import Admin from "@/pages/Admin/Admin";
import ExpressionConfiguration from "@/pages/Animations/Expressions/ExpressionConfiguration/ExpressionConfiguration";
import Expressions from "@/pages/Animations/Expressions/Expressions";
import Main from "@/pages/Main";
import MotorCalibration from "@/pages/MotorCalibration/MotorCalibration";
import MotorConfiguration from "@/pages/MotorCalibration/MotorConfiguration/MotorConfiguration";
import VisemeConfiguration from "@/pages/Animations/Visemes/VisemeConfiguration/VisemeConfiguration";
import Visemes from "@/pages/Animations/Visemes/Visemes";

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
        routes: [
          {
            path: PATHS.MOTOR_CONFIGURE_ID,
            element: <MotorConfiguration />,
            title: "motor-configure-id",
          },
        ],
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
        routes: [
          {
            path: PATHS.VISEME_CONFIGURE_ID,
            element: <VisemeConfiguration />,
            title: "viseme-configure-id",
          },
        ],
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
        routes: [
          {
            path: PATHS.EXPRESSION_CONFIGURE_ID,
            element: <ExpressionConfiguration />,
            title: "expression-configure-id",
          },
        ],
      },
      {
        path: PATHS.ADMIN,
        element: <Admin />,
        title: "admin",
      },
    ],
  },
];

export default pagesData;
