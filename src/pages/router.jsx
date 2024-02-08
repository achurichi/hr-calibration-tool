import React from "react";
import { Route, Routes } from "react-router-dom";
import pagesData from "./pagesData";

const Router = () => {
  const getRoutes = (pagesData) => {
    return pagesData.map(({ path, title, element, routes }) => (
      <Route
        children={routes ? getRoutes(routes) : undefined}
        element={element}
        key={title}
        path={`/${path}`}
      />
    ));
  };

  return <Routes>{getRoutes(pagesData)}</Routes>;
};

export default Router;
