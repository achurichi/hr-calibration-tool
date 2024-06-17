import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";
import isEqual from "lodash/isEqual";

import Form from "react-bootstrap/Form";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";

import ConfigurationSections from "pages/MotorCalibration/MotorConfiguration/ConfigurationSections";
import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";
import Layout from "components/Layout/Layout";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import {
  DESCRIPTION_ITEM_TYPES,
  DESCRIPTION_TYPES,
  MODEL_NAME,
} from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { descriptionStore, motorsConfigurationStore, uiStore } = rootStore;
  const { uiMotorsConfigurationStore } = uiStore;
  const navigate = useNavigate();
  const { motorId } = useParams();
  const methods = useForm(); // maybe need to pass defaultValues once isDirty bug is fixed
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(true);
  const [defaultValues, setDefaultValues] = useState({});
  const [selectedMotorDescription, setSelectedMotorDescription] =
    useState(null);
  const motorsDescription = descriptionStore.getDescriptionItems(
    DESCRIPTION_ITEM_TYPES.MOTOR,
  );
  const selectedOption = uiMotorsConfigurationStore.getSelectedOption();
  const savedConfiguration =
    uiMotorsConfigurationStore.getConfigurationForSelectedMotor();
  const values = methods.getValues();
  const { isValid } = methods.formState;

  // comparing manually because methods.formState.isDirty is not working
  // https://github.com/react-hook-form/react-hook-form/issues/12024
  useEffect(() => {
    setIsDirty(!isEqual(values, defaultValues));
  }, [values, defaultValues]);

  const submitForm = async (data) => {
    console.log("submit", data); // TODO: implement submit
  };

  // load options on mount
  useEffect(() => {
    const updateSelectOptions = async () => {
      const description = await descriptionStore.getOrFetchDescription(
        DESCRIPTION_TYPES.MOTORS,
        MODEL_NAME,
      );
      const motors = description?.motors || [];

      if (!motors.length) {
        uiMotorsConfigurationStore.setOptions([]);
        uiMotorsConfigurationStore.setSelectedOption(null);
        return;
      }

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

      uiMotorsConfigurationStore.setOptions(options);
      uiMotorsConfigurationStore.setSelectedOption(options[motorIndex]);

      const motor = motors[motorIndex];
      const formData = {
        neutralPositionValue: motor.neutralPosition.defaultValue,
        maxPositionValue: motor.maxPosition.defaultValue,
        minPositionValue: motor.minPosition.defaultValue,
      };
      setDefaultValues(formData);
      methods.reset(formData);
    };

    const fetchConfiguration = async () => {
      await motorsConfigurationStore.fetchConfiguration(MODEL_NAME);
    };

    const setup = async () => {
      setIsLoading(true);
      await Promise.all([updateSelectOptions(), fetchConfiguration()]);
      uiMotorsConfigurationStore.setSaveConfiguration(() => {
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

      const { neutralPosition, maxPosition, minPosition } = description;
      methods.reset({
        neutralPositionValue: neutralPosition.defaultValue,
        maxPositionValue: maxPosition.defaultValue,
        minPositionValue: minPosition.defaultValue,
      });

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
    uiMotorsConfigurationStore.setSaveDisabledReason(reason);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isValid, isLoading]);

  return (
    <FormProvider {...methods}>
      <Layout>
        <Layout.Topbar>
          <Select
            className={styles.select}
            onChange={uiMotorsConfigurationStore.setSelectedOption}
            options={uiMotorsConfigurationStore.getOptions()}
            placeholder="Loading..."
            value={selectedOption}
          />
        </Layout.Topbar>
        <Layout.Main>
          <RenderWithLoader
            dependencies={[
              FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_MODEL_NAME,
              FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_MODEL_NAME,
            ]}
            loadingComponent={
              <div className={styles["loader-container"]}>
                <Spinner variant="primary" />
              </div>
            }
          >
            <Form className={styles["form-container"]}>
              <ConfigurationSections
                configuration={savedConfiguration}
                description={selectedMotorDescription}
              />
            </Form>
          </RenderWithLoader>
        </Layout.Main>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
    </FormProvider>
  );
});

export default MotorConfiguration;
