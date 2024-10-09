import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { FormProvider } from "react-hook-form";
import isEmpty from "lodash/isEmpty";

import Form from "react-bootstrap/Form";

import DataForm from "@/pages/Admin/Forms/DataForm";
import Footer from "@/components/Footer/Footer";
import Layout from "@/components/Layout/Layout";
import RenderWithLoader from "@/components/RenderWithLoader/RenderWithLoader";
import SelectionBar from "@/pages/Admin/SelectionBar";
import Spinner from "@/components/Spinner/Spinner";

import useDescriptionForm from "@/pages/Admin/hooks/useDescriptionForm";

import rootStore from "@/stores/root.store";

import { REQUEST_IDS as ANIMATIONS_DESCRIPTIONS_REQUESTS } from "@/apis/calibrationTool/descriptions/animations/animationsApi";
import { REQUEST_IDS as DESCRIPTIONS_REQUESTS } from "@/apis/calibrationTool/descriptions/descriptionsApi";
import { REQUEST_IDS as MOTORS_DESCRIPTIONS_REQUESTS } from "@/apis/calibrationTool/descriptions/motors/motorsApi";

import styles from "./Admin.module.scss";

const Admin = observer(() => {
  const { descriptionStore, uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const { methods, submitForm } = useDescriptionForm();
  const selectedItem = uiDescriptionStore.getSelectedItem();
  const isDirty = !isEmpty(methods.formState.dirtyFields); // not using isDirty because sometimes it's not updated

  useEffect(() => {
    return () => {
      uiDescriptionStore.clear();
      descriptionStore.clearImages();
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
              ANIMATIONS_DESCRIPTIONS_REQUESTS.GET_BY_NAME,
              DESCRIPTIONS_REQUESTS.GET_ALL_DESCRIPTION_NAMES,
              MOTORS_DESCRIPTIONS_REQUESTS.GET_BY_NAME,
            ]}
            loadingComponent={<Spinner className={styles.spinner} />}
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
