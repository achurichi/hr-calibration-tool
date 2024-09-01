import React, { createContext, forwardRef } from "react";

import styles from "./Layout.module.scss";

const LayoutContext = createContext();

const Layout = forwardRef(({ children }, ref) => {
  return (
    <LayoutContext.Provider value={{}}>
      <div className={styles.layout} ref={ref}>
        {children}
      </div>
    </LayoutContext.Provider>
  );
});

const Topbar = forwardRef(({ children }, ref) => {
  return (
    <div className={styles.topbar} ref={ref}>
      <div className={styles["topbar-internal"]}>{children}</div>
    </div>
  );
});

const Main = forwardRef(({ children }, ref) => {
  return (
    <div className={styles.main} ref={ref}>
      <div className={styles["main-internal"]}>{children}</div>
    </div>
  );
});

const Footer = forwardRef(({ children }, ref) => {
  return (
    <div className={styles.footer} ref={ref}>
      {children}
    </div>
  );
});

Layout.Topbar = Topbar;
Layout.Main = Main;
Layout.Footer = Footer;

export default Layout;
