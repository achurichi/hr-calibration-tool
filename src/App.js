import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import Router from "./pages/Router";
import { observer } from "mobx-react";
import { ToastContainer } from "react-toastify";

import rootStore from "stores/root.store";

import { BASE_PATH } from "constants/routes";

function App() {
  const { realmStore } = rootStore;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initRealmStore = async () => {
      await realmStore.init();
      setLoading(false);
    };

    initRealmStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <HashRouter basename={BASE_PATH}>
        <Router />
      </HashRouter>
      <ToastContainer position="bottom-left" autoClose={3000} theme="colored" />
    </>
  );
}

export default observer(App);
