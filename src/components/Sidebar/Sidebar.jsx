import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Nav from "react-bootstrap/Nav";

import {
  BsChevronLeft,
  BsChevronRight,
  BsEmojiLaughing,
  BsPersonCircle,
  BsWrench,
} from "react-icons/bs";
import { GiLips } from "react-icons/gi";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";

import { PATHS } from "../../constants/routes";

import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selected = {
    motorsCalibration: pathname.startsWith(PATHS.MOTORS),
    visemesCalibration: pathname.startsWith(PATHS.VISEMES),
    expressionsCalibration: pathname.startsWith(PATHS.EXPRESSIONS),
    admin: pathname.startsWith(PATHS.ADMIN),
  };

  const options = [
    {
      Icon: BsWrench,
      name: "Motors calibration",
      route: PATHS.MOTORS,
      selected: selected.motorsCalibration,
    },
    {
      Icon: GiLips,
      name: "Visemes calibration",
      route: PATHS.VISEMES,
      selected: selected.visemesCalibration,
    },
    {
      Icon: BsEmojiLaughing,
      name: "Expressions calibration",
      route: PATHS.EXPRESSIONS,
      selected: selected.expressionsCalibration,
    },
    {
      Icon: BsPersonCircle,
      name: "Admin",
      route: PATHS.ADMIN,
      selected: selected.expressionsCalibration,
    },
  ];

  return (
    <Nav
      className={classNames(styles.sidebar, {
        [styles.collapsed]: isCollapsed,
      })}
      onSelect={(route) => navigate(route)}
    >
      <ClickableIcon
        Icon={isCollapsed ? BsChevronRight : BsChevronLeft}
        className={styles["collapse-button"]}
        onClick={() => setIsCollapsed(!isCollapsed)}
      />
      {options.map(({ Icon, name, route, selected }) => (
        <Nav.Item
          key={route}
          className={classNames(styles.item, {
            [styles.selected]: selected,
          })}
        >
          <Nav.Link
            className={classNames(styles.link, {
              [styles.collapsed]: isCollapsed,
            })}
            eventKey={route}
          >
            <Icon className={styles.icon} />
            <div
              className={classNames(styles.text, {
                [styles.collapsed]: isCollapsed,
              })}
            >
              {name}
            </div>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Sidebar;
