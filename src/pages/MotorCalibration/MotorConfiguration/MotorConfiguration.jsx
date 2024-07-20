import React from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";

import useConfigurationFormSetup from "hooks/useConfigurationFormSetup";

import Form from "react-bootstrap/Form";
import Select from "react-select";

import ConfigurationFooter from "pages/components/ConfigurationFooter/ConfigurationFooter";
import ConfigurationSections from "pages/MotorCalibration/MotorConfiguration/ConfigurationSections";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import Layout from "components/Layout/Layout";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Spinner from "components/Spinner/Spinner";

import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
} from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { statusStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { motorId } = useParams();
  const methods = useForm();
  const selectedMotorDescription = useConfigurationFormSetup(
    DESCRIPTION_TYPES.MOTORS,
    DESCRIPTION_ITEM_TYPES.MOTOR,
    motorId,
    methods,
  );
  const selectedOption = uiConfigurationStore.getSelectedOption();

  return (
    <>
      <FormProvider {...methods}>
        <Layout>
          <Layout.Topbar>
            <Select
              className={styles.select}
              isDisabled={statusStore.isLoading(
                FUNCTIONS.MOTORS_CONFIGURATION.SAVE_ITEM,
              )}
              onChange={(option) => {
                uiConfigurationStore.confirmIfDirty(() =>
                  uiConfigurationStore.setSelectedOption(option),
                );
              }}
              options={uiConfigurationStore.getOptions()}
              placeholder="Loading..."
              value={selectedOption}
            />
          </Layout.Topbar>
          <Layout.Main>
            <RenderWithLoader
              dependencies={[
                FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_DESCRIPTION_AND_ASSEMBLY,
                FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_NAME,
              ]}
              loadingComponent={<Spinner className={styles.spinner} />}
            >
              <Form className={styles["form-container"]}>
                <ConfigurationSections description={selectedMotorDescription} />
              </Form>
            </RenderWithLoader>
          </Layout.Main>
          <Layout.Footer>
            <ConfigurationFooter
              checkboxProps={{
                id: "enable-torque",
                label: "Enable torque",
                onChange: uiConfigurationStore.setEnableTorque,
              }}
              descriptionType={DESCRIPTION_TYPES.MOTORS}
              showMotorData
            />
          </Layout.Footer>
        </Layout>
      </FormProvider>
      <ConfirmationModal {...uiConfigurationStore.getUnsavedModalConfig()} />
    </>
  );
});

export default MotorConfiguration;
