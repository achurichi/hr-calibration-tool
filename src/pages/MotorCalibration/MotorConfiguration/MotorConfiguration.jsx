import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import isEmpty from "lodash/isEmpty";

import Select from "react-select";

import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";
import ConfigurationSections from "pages/MotorCalibration/MotorConfiguration/ConfigurationSections";

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

  if (!selectedOption) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles["config-container"]}>
        <div className={styles["config-internal-container"]}>
          <div className={styles["select-container"]}>
            <Select
              onChange={onMotorSelect}
              options={selectOptions}
              value={selectedOption}
            />
          </div>
          <div className={styles.configs}>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default MotorConfiguration;
