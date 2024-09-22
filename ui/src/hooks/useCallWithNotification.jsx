import { toast } from "react-toastify";

import rootStore from "stores/root.store";

import { STATUS_TYPES } from "constants/status";

const useCallWithNotification = () => {
  const { requestStore } = rootStore;

  const callWithNotification = async (
    fn,
    statusId,
    successMessage,
    errorMessage,
  ) => {
    const result = { result: await fn() };
    const status = requestStore.getStatus(statusId);

    if (status.type === STATUS_TYPES.SUCCESS) {
      result.success = true;
      if (successMessage) {
        toast.success(successMessage);
      }
    } else if (
      status.type === STATUS_TYPES.ERROR &&
      (errorMessage || status.message)
    ) {
      result.success = false;
      if (errorMessage || status.message) {
        toast.error(errorMessage || status.message);
      }
    }

    return result;
  };

  return callWithNotification;
};

export default useCallWithNotification;
