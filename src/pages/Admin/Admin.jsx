import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import cloneDeep from "lodash/cloneDeep";

import Button from "components/Button/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import useCallWithNotification from "hooks/useCallWithNotification";
import useDefaultForm from "pages/Admin/Forms/useDefaultForm";

import rootStore from "stores/root.store";

import { blobUrlToBase64String } from "utils/blob";
import { cleanObject } from "utils/object";
import { convertItemToForm } from "pages/Admin/utils";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
  NEW_ITEM_OPTION,
} from "constants/descriptions";

import ConfigurationBar from "pages/Admin/ConfigurationBar";
import DataForm from "pages/Admin/Forms/DataForm";

import styles from "./Admin.module.scss";

const Admin = observer(() => {
  const { descriptionStore, uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const defaultForm = useDefaultForm();
  const methods = useForm({ defaultValues: defaultForm });
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const selectedItem = uiDescriptionStore.getSelectedItem();

  useEffect(() => {
    return () => {
      uiDescriptionStore.clear();
      descriptionStore.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const configureDescription = async () => {
      if (!selectedConfiguration) {
        return;
      }

      uiDescriptionStore.setEditDisabled(true);

      const descriptionType =
        DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
      const description = descriptionStore.getDescription(descriptionType);

      if (!description) {
        await descriptionStore.fetchDescription(descriptionType, MODEL_NAME);
      }

      uiDescriptionStore.setSelectedItem(
        uiDescriptionStore.getItemOptions()[0],
      );

      uiDescriptionStore.setEditDisabled(false);
    };

    configureDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConfiguration]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    if (selectedItem.value === NEW_ITEM_OPTION.value) {
      methods.reset(defaultForm);
      return;
    }

    const item = descriptionStore.getItemById(
      selectedItem.value,
      selectedConfiguration.value,
    );
    methods.reset(convertItemToForm(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

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

  const prepareData = async (data) => {
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

  const onSubmit = async (data) => {
    uiDescriptionStore.setEditDisabled(true);

    let preparedData;
    try {
      preparedData = await prepareData(data);
    } catch (e) {
      toast.error(e.message);
      uiDescriptionStore.setEditDisabled(false);
      return;
    }

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
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

  return (
    <div className={styles.container}>
      <ConfigurationBar />
      <RenderWithLoader
        dependencies={[
          FUNCTIONS.MOTORS_DESCRIPTIONS.GET_BY_MODEL_NAME,
          FUNCTIONS.ANIMATIONS_DESCRIPTIONS.GET_BY_MODEL_NAME,
        ]}
        loadingComponent={
          <div className={styles["loader-container"]}>
            <Spinner variant="primary" />
          </div>
        }
      >
        {selectedItem && (
          <FormProvider {...methods}>
            <Form
              onSubmit={methods.handleSubmit(onSubmit)}
              className={styles["form-container"]}
            >
              <div className={styles["data-form-container"]}>
                <DataForm />
              </div>
              <div className={styles.footer}>
                <Button
                  disabled={uiDescriptionStore.getEditDisabled()}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </Form>
          </FormProvider>
        )}
      </RenderWithLoader>
    </div>
  );
});

export default Admin;
