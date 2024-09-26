import React, { useEffect, useRef } from "react";
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
import { REQUEST_IDS as MOTORS_CONFIGURATIONS_REQUESTS } from "apis/calibrationTool/configurations/motors/motorsApi";
import { REQUEST_IDS as MOTORS_DESCRIPTIONS_REQUESTS } from "apis/calibrationTool/descriptions/motors/motorsApi";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { requestStore, uiStore } = rootStore;
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
  const mainRef = useRef(null);

  // scroll to top when motor changes
  useEffect(() => {
    mainRef?.current?.scrollTo(0, 0);
  }, [motorId]);

  return (
    <>
      <FormProvider {...methods}>
        <Layout>
          <Layout.Topbar>
            <Select
              className={styles.select}
              isDisabled={requestStore.isLoading(
                MOTORS_CONFIGURATIONS_REQUESTS.SAVE_CONFIGURATION_ITEM,
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
          <Layout.Main
            ref={mainRef}
            className={
              uiConfigurationStore.getFullscreen() ? styles.main : undefined
            }
          >
            <RenderWithLoader
              dependencies={[
                MOTORS_CONFIGURATIONS_REQUESTS.GET_BY_DESCRIPTION_AND_ASSEMBLY,
                MOTORS_DESCRIPTIONS_REQUESTS.GET_BY_NAME,
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
