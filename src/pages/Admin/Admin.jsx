import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";

import Button from "components/Button/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import useDescriptionForm from "pages/Admin/hooks/useDescriptionForm";

import rootStore from "stores/root.store";

import { FUNCTIONS } from "constants/mongo";
import {
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
  const { defaultForm, prepareFormToRender, submitForm } = useDescriptionForm();
  const methods = useForm({ defaultValues: defaultForm });
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const selectedItem = uiDescriptionStore.getSelectedItem();
  const isDirty = !isEmpty(methods.formState.dirtyFields); // not using isDirty because sometimes it's not updated

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
    if (!selectedItem || selectedItem.value === NEW_ITEM_OPTION.value) {
      methods.reset(defaultForm);
      return;
    }

    const item = descriptionStore.getItemById(
      selectedItem.value,
      selectedConfiguration.value,
    );
    methods.reset(); // reset with no arguments to clean empty fields with spaces
    methods.reset(prepareFormToRender(item));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <div className={styles.container}>
      <ConfigurationBar unsaved={isDirty} />
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
              onSubmit={methods.handleSubmit(submitForm)}
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
