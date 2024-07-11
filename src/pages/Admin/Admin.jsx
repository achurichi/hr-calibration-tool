import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";

import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";

import SelectionBar from "pages/Admin/SelectionBar";
import DataForm from "pages/Admin/Forms/DataForm";
import Footer from "components/Footer/Footer";
import Layout from "components/Layout/Layout";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import useDescriptionForm from "pages/Admin/hooks/useDescriptionForm";

import rootStore from "stores/root.store";

import { FUNCTIONS } from "constants/mongo";

import styles from "./Admin.module.scss";

const Admin = observer(() => {
  const { uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const { methods, submitForm } = useDescriptionForm();
  const selectedItem = uiDescriptionStore.getSelectedItem();
  const isDirty = !isEmpty(methods.formState.dirtyFields); // not using isDirty because sometimes it's not updated

  useEffect(() => {
    return () => {
      uiDescriptionStore.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <Layout>
        <Layout.Topbar>
          <SelectionBar unsaved={isDirty} />
        </Layout.Topbar>
        <Layout.Main>
          <RenderWithLoader
            dependencies={[
              FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_NAME,
              FUNCTIONS.ANIMATIONS_DESCRIPTION.GET_BY_NAME,
              FUNCTIONS.DESCRIPTIONS.GET_DESCRIPTIONS_NAMES,
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
                onClick: submitForm,
              },
            ]}
          />
        </Layout.Footer>
      </Layout>
    </FormProvider>
  );
});

export default Admin;
