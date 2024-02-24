import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";

import styles from "./Main.module.scss";

const Main = () => {
  return (
    <div className={styles.main}>
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Main;
