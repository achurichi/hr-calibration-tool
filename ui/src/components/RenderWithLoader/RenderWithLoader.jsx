import { observer } from "mobx-react";

import rootStore from "stores/root.store";

const RenderWithLoader = observer(
  ({ dependencies, loadingComponent, children }) => {
    const { requestStore } = rootStore;
    const isLoading = requestStore.isLoading(dependencies);

    if (isLoading) {
      return loadingComponent;
    }

    return children;
  },
);

export default RenderWithLoader;
