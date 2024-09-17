import React, { createContext, forwardRef } from "react";
import classNames from "classnames";

import styles from "./Layout.module.scss";

const LayoutContext = createContext();

const Layout = forwardRef(({ children, className }, ref) => {
  return (
    <LayoutContext.Provider value={{}}>
      <div className={classNames(styles.layout, className)} ref={ref}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
});

const Topbar = forwardRef(({ children, className }, ref) => {
  return (
    <div className={classNames(styles.topbar, className)} ref={ref}>
      <div className={styles["topbar-internal"]}>{children}</div>
    </div>
  );
});

const Main = forwardRef(({ children, className }, ref) => {
  return (
    <div className={classNames(styles.main, className)} ref={ref}>
      <div className={styles["main-internal"]}>{children}</div>
    </div>
  );
});

const Footer = forwardRef(({ children, className }, ref) => {
  return (
    <div className={classNames(styles.footer, className)} ref={ref}>
      {children}
    </div>
  );
});

Layout.Topbar = Topbar;
Layout.Main = Main;
Layout.Footer = Footer;

export default Layout;
