import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import isEmpty from "lodash/isEmpty";

import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";

import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";
import ConfigurationSections from "pages/MotorCalibration/MotorConfiguration/ConfigurationSections";

import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { motorConfigurationStore, motorsStore, uiStore } = rootStore;
  const { motorConfigurationStore: uiMotorConfigurationStore } = uiStore;
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [editableConfig, setEditableConfig] = useState(null);
  const motorConfig = motorConfigurationStore.getMotorConfig();

  // Load options on mount
  useEffect(() => {
    const updateSelectOptions = async () => {
      await motorsStore.fetchMotors();
      const options = uiMotorConfigurationStore.getMotorOptions();
      const selectOptions = options.map(({ name, description, id }) => ({
        label: (
          <div>
            <strong>{`${name}`}</strong>
            <span
              className={styles["motor-description"]}
            >{` - ${description}`}</span>
          </div>
        ),
        value: id,
      }));
      setSelectOptions(selectOptions);

      const defaultOption = selectOptions?.[0] || null;
      setSelectedOption(defaultOption);
      if (defaultOption) {
        onMotorSelect(defaultOption);
      }
    };
    updateSelectOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change the selected option when the motor configuration changes
  useEffect(() => {
    if (!motorConfig || isEmpty(selectOptions)) {
      return;
    }

    const option = selectOptions.find((o) => o.value === motorConfig.motorId);
    if (option) {
      setSelectedOption(option);
    }

    setEditableConfig(motorConfig);
  }, [motorConfig, selectOptions, selectedOption]);

  const onMotorSelect = async (selectedOption) => {
    motorConfigurationStore.fetchMotor(selectedOption.value);
  };

  return (
    <div className={styles.container}>
      <Select
        className={styles.select}
        onChange={onMotorSelect}
        options={selectOptions}
        placeholder="Loading..."
        value={selectedOption}
      />
      <div className={styles.configs}>
        <RenderWithLoader
          dependencies={[FUNCTIONS.MOTOR_CONFIGURATIONS.GET_BY_MOTOR_ID]}
          loadingComponent={
            <div className={styles["loader-container"]}>
              <Spinner variant="primary" />
            </div>
          }
        >
          <ConfigurationSections
            editableConfig={editableConfig}
            motorConfig={motorConfig}
            onChange={(prop, value) => {
              setEditableConfig({
                ...editableConfig,
                [prop]: {
                  ...editableConfig[prop],
                  value,
                },
              });
            }}
          />
        </RenderWithLoader>
      </div>
      <Footer />
    </div>
  );
});

export default MotorConfiguration;
