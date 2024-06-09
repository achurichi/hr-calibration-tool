import { toast } from "react-toastify";

import rootStore from "stores/root.store";

import { STATUS_TYPES } from "constants/status";

const useCallWithNotification = () => {
  const { statusStore } = rootStore;

  const callWithNotification = async (
    fn,
    statusId,
    successMessage,
    errorMessage,
  ) => {
    const result = await fn();
    const status = statusStore.getStatus(statusId);

    if (status.type === STATUS_TYPES.SUCCESS && successMessage) {
      toast.success(successMessage);
    } else if (
      status.type === STATUS_TYPES.ERROR &&
      (errorMessage || status.message)
    ) {
      toast.error(errorMessage || status.message);
    }

    return result;
  };

  return callWithNotification;
};

export default useCallWithNotification;
