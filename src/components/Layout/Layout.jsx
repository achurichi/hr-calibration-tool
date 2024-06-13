import React, { createContext } from "react";

import styles from "./Layout.module.scss";

const LayoutContext = createContext();

const Layout = ({ children }) => {
  return (
    <LayoutContext.Provider value={{}}>
      <div className={styles.layout}>{children}</div>
    </LayoutContext.Provider>
  );
};

const Topbar = ({ children }) => {
  return (
    <div className={styles.topbar}>
      <div className={styles["topbar-internal"]}>{children}</div>
    </div>
  );
};

const Main = ({ children }) => {
  return (
    <div className={styles.main}>
      <div className={styles["main-internal"]}>{children}</div>
    </div>
  );
};

const Footer = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

Layout.Topbar = Topbar;
Layout.Main = Main;
Layout.Footer = Footer;

export default Layout;
