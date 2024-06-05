import rootStore from "stores/root.store";
import { toast } from "react-toastify";
import cloneDeep from "lodash/cloneDeep";

import useCallWithNotification from "hooks/useCallWithNotification";
import useDescriptionType from "pages/Admin/hooks/useDescriptionType";

import { blobUrlToBase64String } from "utils/blob";
import { cleanObject } from "utils/object";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
} from "constants/descriptions";
import {
  DEFAULT_EXPRESSION_FORM,
  DEFAULT_MOTOR_FORM,
  DEFAULT_VISEME_FORM,
} from "constants/forms";

const useDescriptionForm = () => {
  const { descriptionStore, uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const defaultBaseForm = useDescriptionType({
    [DESCRIPTION_ITEM_TYPES.MOTOR]: DEFAULT_MOTOR_FORM,
    [DESCRIPTION_ITEM_TYPES.VISEME]: DEFAULT_VISEME_FORM,
    [DESCRIPTION_ITEM_TYPES.EXPRESSION]: DEFAULT_EXPRESSION_FORM,
  });
  const configurationType =
    uiDescriptionStore.getSelectedConfiguration()?.value;

  const prepareFormToRender = (baseForm) => {
    if (!baseForm) {
      return null;
    }

    // clone deep to avoid editing to the original object
    const form = cloneDeep(baseForm);

    // need to convert flat arrays to objects because useFieldArray from react-hook-form expects objects
    if (configurationType === DESCRIPTION_ITEM_TYPES.MOTOR) {
      ["neutralPosition", "minPosition", "maxPosition"].forEach((position) => {
        form[position].images = form[position].images.map((fileId) => ({
          fileId,
        }));
      });
    } else if (
      configurationType === DESCRIPTION_ITEM_TYPES.EXPRESSION ||
      configurationType === DESCRIPTION_ITEM_TYPES.VISEME
    ) {
      form.images = form.images.map((fileId) => ({ fileId }));
      form.motions = form.motions.map((motion) => ({ value: motion }));
    }

    return form;
  };

  const uploadImages = async (images) => {
    const promises = images.map(async (image) => {
      if (image.fileId) {
        return image.fileId; // the image is already uploaded
      }
      const base64 = await blobUrlToBase64String(image.url);
      const id = await descriptionStore.saveImage(base64);
      if (!id) {
        throw new Error("Failed to save image");
      }
      return id;
    });
    return await Promise.allSettled(promises);
  };

  const prepareFormToUpload = async (data) => {
    const clonedData = cloneDeep(data); // TODO: don't clone
    let failed = 0;
    // TODO: Extend this for animations
    const positionPromises = [
      "neutralPosition",
      "minPosition",
      "maxPosition",
    ].map(async (item) => {
      const imagePromises = await uploadImages(clonedData[item].images);
      const failedPromises = imagePromises.filter(
        (p) => p.status === "rejected",
      );
      failed += failedPromises.length;
      clonedData[item].images = imagePromises
        .filter((p) => p.status === "fulfilled")
        .map((p) => p.value);
    });

    await Promise.all(positionPromises);
    if (failed) {
      // TODO: delete the images that were saved
      throw new Error(`Error: ${failed} image(s) couldn't be saved`);
    }

    return cleanObject(clonedData);
  };

  const submitForm = async (data) => {
    uiDescriptionStore.setEditDisabled(true);

    let preparedData;
    try {
      preparedData = await prepareFormToUpload(data);
    } catch (e) {
      toast.error(e.message);
      uiDescriptionStore.setEditDisabled(false);
      return;
    }

    const descriptionType = DESCRIPTION_TYPES_MAP[configurationType];
    const saveFn = async () => {
      await descriptionStore.saveItem(
        descriptionType,
        MODEL_NAME,
        preparedData,
      );
    };
    const fnId =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? FUNCTIONS.MOTORS_DESCRIPTIONS.SAVE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTIONS.SAVE_ITEM;

    await callWithNotification(saveFn, fnId, "Configuration saved");
    uiDescriptionStore.setSelectedItemByName(data.name);
    uiDescriptionStore.setEditDisabled(false);
  };

  return {
    defaultForm: prepareFormToRender(defaultBaseForm),
    prepareFormToRender,
    submitForm,
  };
};

export default useDescriptionForm;
