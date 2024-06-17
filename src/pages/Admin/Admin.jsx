import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";

import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import ConfigurationBar from "pages/Admin/ConfigurationBar";
import DataForm from "pages/Admin/Forms/DataForm";
import Footer from "components/Footer/Footer";
import Layout from "components/Layout/Layout";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import useDescriptionForm from "pages/Admin/hooks/useDescriptionForm";

import rootStore from "stores/root.store";

import { FUNCTIONS } from "constants/mongo";
import {
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
  NEW_ITEM_OPTION,
} from "constants/descriptions";

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
      await descriptionStore.getOrFetchDescription(descriptionType, MODEL_NAME);

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
    <FormProvider {...methods}>
      <Layout>
        <Layout.Topbar>
          <ConfigurationBar unsaved={isDirty} />
        </Layout.Topbar>
        <Layout.Main>
          <RenderWithLoader
            dependencies={[
              FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_MODEL_NAME,
              FUNCTIONS.ANIMATIONS_DESCRIPTION.GET_BY_MODEL_NAME,
            ]}
            loadingComponent={
              <div className={styles["loader-container"]}>
                <Spinner variant="primary" />
              </div>
            }
          >
            {selectedItem && (
              <Form className={styles["form-container"]}>
                <DataForm />
              </Form>
            )}
          </RenderWithLoader>
        </Layout.Main>
        <Layout.Footer>
          <Footer
            buttons={[
              {
                disabled: uiDescriptionStore.getEditDisabled() || !selectedItem,
                label: "Save",
                onClick: () => {
                  const submitFn = methods.handleSubmit(submitForm);
                  submitFn();
                },
              },
            ]}
          />
        </Layout.Footer>
      </Layout>
    </FormProvider>
  );
});

export default Admin;
