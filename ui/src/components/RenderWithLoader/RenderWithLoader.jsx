import { observer } from "mobx-react";

import rootStore from "stores/root.store";

const RenderWithLoader = observer(
  ({ dependencies, loadingComponent, children }) => {
    const { statusStore } = rootStore;
    const isLoading = statusStore.isLoading(dependencies);

    if (isLoading) {
      return loadingComponent;
    }

    return children;
  },
);

export default RenderWithLoader;
