import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import Nav from "react-bootstrap/Nav";

import { BsChevronLeft, BsEmojiLaughing, BsWrench } from "react-icons/bs";
import { GiLips } from "react-icons/gi";

import { PATHS } from "../../constants/routes";

import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const selected = {
    motorsCalibration: pathname.startsWith("/motors"),
    visemesCalibration: pathname.startsWith("/visemes"),
    expressionsCalibration: pathname.startsWith("/expressions"),
  };

  return (
    <Nav className={styles.sidebar} onSelect={(route) => navigate(route)}>
      <div className={styles.collapse}>
        <BsChevronLeft size={20} />
      </div>
      <Nav.Item
        className={classNames(styles.item, {
          [styles.selected]: selected.motorsCalibration,
        })}
      >
        <Nav.Link className={styles.link} eventKey={PATHS.MOTORS}>
          <BsWrench size={20} />
          Motors calibration
        </Nav.Link>
      </Nav.Item>
      <Nav.Item
        className={classNames(styles.item, {
          [styles.selected]: selected.visemesCalibration,
        })}
      >
        <Nav.Link className={styles.link} eventKey={PATHS.VISEMES}>
          <GiLips size={20} />
          Visemes calibration
        </Nav.Link>
      </Nav.Item>
      <Nav.Item
        className={classNames(styles.item, {
          [styles.selected]: selected.expressionsCalibration,
        })}
      >
        <Nav.Link className={styles.link} eventKey={PATHS.EXPRESSIONS}>
          <BsEmojiLaughing size={20} />
          Expressions calibration
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
