import React, { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import Router from "./pages/Router";
import { observer } from "mobx-react";
import { ToastContainer } from "react-toastify";

import Spinner from "components/Spinner/Spinner";

import rootStore from "stores/root.store";

import { BASE_PATH } from "constants/routes";

function App() {
  const { realmStore, robotStore } = rootStore;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await realmStore.init();

      // TODO: Init websocket and get assembly ids

      await robotStore.fetchDescriptionNamesByAssembly({
        body: "test_body_assembly",
        head: "test_head_assembly",
      });

      setLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Spinner className="vw-100 vh-100" />;
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
