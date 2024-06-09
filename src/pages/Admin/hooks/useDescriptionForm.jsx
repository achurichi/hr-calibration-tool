import rootStore from "stores/root.store";
import { toast } from "react-toastify";
import cloneDeep from "lodash/cloneDeep";

import useCallWithNotification from "hooks/useCallWithNotification";
import useDescriptionType from "pages/Admin/hooks/useDescriptionType";

import { blobUrlToBase64String } from "utils/blob";
import { clean, trimStrings } from "utils/object";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
} from "constants/descriptions";
import {
  DEFAULT_EXPRESSION_FORM,
  DEFAULT_MOTION_FORM,
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

    // clone deep to avoid editing to the original nested object
    // use defaultBaseForm because react-hook-form expects a form with all the fields
    const form = cloneDeep({ ...defaultBaseForm, ...baseForm });

    // need to convert flat arrays to objects because useFieldArray from react-hook-form expects objects
    if (configurationType === DESCRIPTION_ITEM_TYPES.MOTOR) {
      ["neutralPosition", "minPosition", "maxPosition"].forEach((position) => {
        form[position] = {
          ...defaultBaseForm[position],
          ...baseForm[position],
        };
        form[position].images = form[position].images.map((id) => ({
          value: { id },
        }));
      });
    } else if (
      configurationType === DESCRIPTION_ITEM_TYPES.EXPRESSION ||
      configurationType === DESCRIPTION_ITEM_TYPES.VISEME
    ) {
      form.images = form.images.map((id) => ({ value: { id } }));
      form.motions = form.motions.map((motion) => ({
        value: { ...DEFAULT_MOTION_FORM, ...motion },
      }));
    }

    return form;
  };

  const showUploadingInfoMessage = (toUpload) => {
    if (toUpload >= 5) {
      toast.info(`Uploading ${toUpload} images, this may take a while`, {
        autoClose: 5000,
      });
    }
  };

  const uploadImages = async (images) => {
    const promises = images.map(async (image) => {
      if (image.value.id) {
        return image.value.id; // the image is already uploaded
      }
      const base64 = await blobUrlToBase64String(image.value.url);
      const id = await descriptionStore.saveImage(base64);
      if (!id) {
        throw new Error("Failed to save image");
      }
      return id;
    });
    return await Promise.allSettled(promises);
  };

  const processImages = async (images) => {
    const imageResults = await uploadImages(images);
    const ids = imageResults
      .filter((p) => p.status === "fulfilled")
      .map((p) => p.value);
    const failed = imageResults.filter((p) => p.status === "rejected").length;
    return { ids, failed };
  };

  const prepareFormToUpload = async (data) => {
    const clonedData = trimStrings(cloneDeep(data)); // TODO: don't clone

    // check if the name already exists in another item
    const desriptionItems = uiDescriptionStore.getDescriptionItems();
    const invalidName = desriptionItems.some(
      (item) => item.name === clonedData.name && item.id !== clonedData.id,
    );
    if (invalidName) {
      throw new Error("Name already exists");
    }

    let failed = 0;
    if (configurationType === DESCRIPTION_ITEM_TYPES.MOTOR) {
      let toUpload = 0;
      const positionPromises = [
        "neutralPosition",
        "minPosition",
        "maxPosition",
      ].map(async (item) => {
        toUpload += clonedData[item].images.length;
        const processedImages = await processImages(clonedData[item].images);
        clonedData[item].images = processedImages.ids;
        failed += processedImages.failed;
      });
      showUploadingInfoMessage(toUpload);
      await Promise.all(positionPromises);
    } else if (
      configurationType === DESCRIPTION_ITEM_TYPES.EXPRESSION ||
      configurationType === DESCRIPTION_ITEM_TYPES.VISEME
    ) {
      showUploadingInfoMessage(clonedData.images.length);
      const processedImages = await processImages(clonedData.images);
      clonedData.images = processedImages.ids;
      failed += processedImages.failed;
      clonedData.motions = clonedData.motions.map((motion) => motion.value);
    }

    if (failed) {
      // TODO: delete the images that were saved
      throw new Error(`Error: ${failed} image(s) couldn't be saved`);
    }

    return clean(clonedData);
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
    uiDescriptionStore.setSelectedItemByName(preparedData.name);
    uiDescriptionStore.setEditDisabled(false);
  };

  return {
    defaultForm: prepareFormToRender(defaultBaseForm),
    prepareFormToRender,
    submitForm,
  };
};

export default useDescriptionForm;
