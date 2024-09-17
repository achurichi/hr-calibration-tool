import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { observer } from "mobx-react";
import pagesData from "pages/pagesData";

import rootStore from "stores/root.store";

import { PATHS } from "constants/routes";

const Router = observer(() => {
  const { realmStore } = rootStore;

  const getRoutes = (pagesData) => {
    return pagesData.map(({ path, title, element, routes }) => (
      <Route
        children={routes ? getRoutes(routes) : undefined}
        element={
          realmStore.getAuthenticated() || path === PATHS.LOGIN ? (
            element
          ) : (
            <Navigate to={PATHS.LOGIN} replace={false} />
          )
        }
        key={title}
        path={path}
      />
    ));
  };

  return <Routes>{getRoutes(pagesData)}</Routes>;
});

export default Router;
