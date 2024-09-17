import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Nav from "react-bootstrap/Nav";

import { BsEmojiLaughing, BsPersonCircle, BsWrench } from "react-icons/bs";
import { MdOutlineMenu } from "react-icons/md";
import { GiLips } from "react-icons/gi";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import Tooltip from "components/Tooltip/Tooltip";

import { PATHS } from "constants/routes";

import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isCollapsed, setIsCollapsed] = useState(true);

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
      bottom: true,
      name: "Admin",
      route: PATHS.ADMIN,
      selected: selected.admin,
    },
  ];
  const topOptions = options.filter(({ bottom }) => !bottom);
  const bottomOptions = options.filter(({ bottom }) => bottom);

  const renderOption = ({ Icon, name, route, selected }) => (
    <Nav.Item
      key={route}
      className={classNames(styles.item, {
        [styles.selected]: selected,
      })}
    >
      <Tooltip
        content={name}
        id={`tooltip-${name}`}
        placement="right"
        show={isCollapsed ? undefined : false}
      >
        <Nav.Link
          className={classNames(styles.link, {
            [styles.collapsed]: isCollapsed,
          })}
          eventKey={route}
        >
          <div className={styles["icon-container"]}>
            <Icon className={styles.icon} />
          </div>
          <div
            className={classNames(styles.text, {
              [styles.collapsed]: isCollapsed,
            })}
          >
            {name}
          </div>
        </Nav.Link>
      </Tooltip>
    </Nav.Item>
  );

  return (
    <Nav
      className={classNames(styles.sidebar, {
        [styles.collapsed]: isCollapsed,
      })}
      onSelect={(route) => navigate(route)}
    >
      <div className={styles["top-options"]}>
        <div className={styles["collapse-button-container"]}>
          <ClickableIcon
            Icon={MdOutlineMenu}
            className={styles["collapse-button"]}
            onClick={() => setIsCollapsed(!isCollapsed)}
            size={18}
          />
        </div>
        {topOptions.map(renderOption)}
      </div>
      <div>{bottomOptions.map(renderOption)}</div>
    </Nav>
  );
};

export default Sidebar;
