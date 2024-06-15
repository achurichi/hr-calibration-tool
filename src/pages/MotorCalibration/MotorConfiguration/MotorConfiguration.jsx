import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

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

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { descriptionStore, motorsConfigurationStore, uiStore } = rootStore;
  const { uiMotorsConfigurationStore } = uiStore;
  const [selectedMotorDescription, setSelectedMotorDescription] =
    useState(null);
  const motorsDescription = descriptionStore.getDescriptionItems(
    DESCRIPTION_ITEM_TYPES.MOTOR,
  );
  const selectedOption = uiMotorsConfigurationStore.getSelectedOption();
  const savedConfiguration =
    uiMotorsConfigurationStore.getConfigurationForSelectedMotor();

  // Load options on mount
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

      uiMotorsConfigurationStore.setOptions(options);
      uiMotorsConfigurationStore.setSelectedOption(options?.[0] || null);
    };

    const fetchConfiguration = async () => {
      await motorsConfigurationStore.fetchConfig(MODEL_NAME);
    };

    updateSelectOptions();
    fetchConfiguration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedOption && motorsDescription) {
      setSelectedMotorDescription(
        motorsDescription.find((m) => m.id === selectedOption.value),
      );
    }
  }, [selectedOption, motorsDescription]);

  return (
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
          <ConfigurationSections
            className={styles["configuration-sections"]}
            configuration={savedConfiguration}
            description={selectedMotorDescription}
            // onChange={(prop, value) => {
            //   setEditableConfig({
            //     ...editableConfig,
            //     [prop]: {
            //       ...editableConfig[prop],
            //       value,
            //     },
            //   });
            // }}
          />
        </RenderWithLoader>
      </Layout.Main>
      <Layout.Footer>
        <Footer />
      </Layout.Footer>
    </Layout>
  );
});

export default MotorConfiguration;
