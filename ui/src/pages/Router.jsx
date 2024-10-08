import { Route, Routes } from 'react-router-dom';
import { observer } from 'mobx-react';
import pagesData from '@/pages/pagesData';

const Router = observer(() => {
  const getRoutes = (pagesData) => {
    return pagesData.map(({ path, title, element, routes }) => (
      <Route element={element} key={title} path={path}>
        {routes ? getRoutes(routes) : undefined}
      </Route>
    ));
  };

  return <Routes>{getRoutes(pagesData)}</Routes>;
});

export default Router;
