import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from '@/pages/Router';
import { observer } from 'mobx-react';
import { ToastContainer } from 'react-toastify';

import Spinner from '@/components/Spinner/Spinner';

import rootStore from '@/stores/root.store';

import { STATUS_TYPES } from '@/constants/status';

const App = observer(() => {
  const { robotStore, rosStore } = rootStore;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { status } = await rosStore.init();
      if (status !== STATUS_TYPES.SUCCESS) {
        return;
      }

      const head = await rosStore.getHead();
      const body = await rosStore.getBody();

      // rosStore.publishTest();
      // rosStore.subscribeTest();
      // await rosStore.serviceTest();
      // await rosStore.setParamTest();
      // await rosStore.getParamTest();

      // TODO: Get assembly ids from websockets

      await robotStore.fetchDescriptionNamesByAssembly({
        body,
        head,
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
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <ToastContainer position="bottom-left" autoClose={3000} theme="colored" />
    </>
  );
});

export default App;
