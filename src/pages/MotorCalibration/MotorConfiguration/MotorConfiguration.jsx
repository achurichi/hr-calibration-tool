import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";

import useCallWithNotification from "hooks/useCallWithNotification";

import Form from "react-bootstrap/Form";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";

import ConfigurationSections from "pages/MotorCalibration/MotorConfiguration/ConfigurationSections";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";
import Layout from "components/Layout/Layout";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
  MODEL_NAME,
  ROBOT_NAME,
} from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { descriptionStore, motorsConfigurationStore, statusStore, uiStore } =
    rootStore;
  const { uiConfigurationStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const navigate = useNavigate();
  const { motorId } = useParams();
  const methods = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMotorDescription, setSelectedMotorDescription] =
    useState(null);
  const motorsDescription = descriptionStore.getDescriptionItems(
    DESCRIPTION_ITEM_TYPES.MOTOR,
  );
  const selectedOption = uiConfigurationStore.getSelectedOption();
  const { isDirty, isValid } = methods.formState;

  const submitForm = async (data) => {
    const result = await callWithNotification(
      () => motorsConfigurationStore.saveMotor(MODEL_NAME, ROBOT_NAME, data),
      FUNCTIONS.MOTORS_CONFIGURATION.SAVE_MOTOR,
      "Configuration saved",
    );

    if (result) {
      // don't need to reset the form just clear the dirty state
      methods.reset(undefined, { keepValues: true });
    }
  };

  // load options on mount
  useEffect(() => {
    const loadOptions = async () => {
      const description = await descriptionStore.getOrFetchDescription(
        DESCRIPTION_TYPES.MOTORS,
        MODEL_NAME,
      );
      const motors = description?.motors || [];

      if (!motors.length) {
        uiConfigurationStore.setOptions([]);
        uiConfigurationStore.setSelectedOption(null);
        return;
      }

      await motorsConfigurationStore.fetchConfiguration(MODEL_NAME, ROBOT_NAME);

      const options = motors.map(({ name, description, id }) => ({
        label: (
          <div>
            <strong>{`${name}`}</strong>
            {description && (
              <span
                className={styles["motor-description"]}
              >{` - ${description}`}</span>
            )}
          </div>
        ),
        value: id,
      }));

      let motorIndex = motors.findIndex((m) => m.id === motorId);
      if (motorIndex === -1) {
        motorIndex = 0;
      }

      uiConfigurationStore.setOptions(options);
      uiConfigurationStore.setSelectedOption(options[motorIndex]);
    };

    const setup = async () => {
      setIsLoading(true);
      await loadOptions();
      uiConfigurationStore.setSaveConfiguration(() => {
        const submitFn = methods.handleSubmit(submitForm);
        submitFn();
      });
      setIsLoading(false);
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedOption && motorsDescription) {
      const description = motorsDescription.find(
        (m) => m.id === selectedOption.value,
      );
      setSelectedMotorDescription(description);

      const configuredMotor = motorsConfigurationStore.getMotor(description.id);

      if (configuredMotor) {
        // if the class object is passed the form is not reset properly
        methods.reset({ ...configuredMotor });
      } else {
        const { neutralPosition, maxPosition, minPosition } = description;
        methods.reset({
          motorId: description.id,
          motorName: description.name,
          neutralPositionValue: neutralPosition.defaultValue,
          maxPositionValue: maxPosition.defaultValue,
          minPositionValue: minPosition.defaultValue,
        });
      }

      navigate(`${PATHS.MOTOR_CONFIGURE}/${selectedOption.value}`, {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, motorsDescription]);

  useEffect(() => {
    let reason = null;
    if (isLoading) {
      reason = "Loading...";
    } else if (!isDirty) {
      reason = "Set values to enable saving";
    } else if (!isValid) {
      reason = "Some fields are invalid";
    }
    uiConfigurationStore.setSaveDisabledReason(reason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isValid, isLoading]);

  useEffect(() => {
    uiConfigurationStore.setDirtyForm(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <>
      <FormProvider {...methods}>
        <Layout>
          <Layout.Topbar>
            <Select
              className={styles.select}
              isDisabled={statusStore.isLoading(
                FUNCTIONS.MOTORS_CONFIGURATION.SAVE_MOTOR,
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
                FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_MODEL_ROBOT_NAME,
                FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_MODEL_NAME,
              ]}
              loadingComponent={
                <div className={styles["loader-container"]}>
                  <Spinner variant="primary" />
                </div>
              }
            >
              <Form className={styles["form-container"]}>
                <ConfigurationSections description={selectedMotorDescription} />
              </Form>
            </RenderWithLoader>
          </Layout.Main>
          <Layout.Footer>
            <Footer />
          </Layout.Footer>
        </Layout>
      </FormProvider>
      <ConfirmationModal {...uiConfigurationStore.getUnsavedModalConfig()} />
    </>
  );
});

export default MotorConfiguration;
