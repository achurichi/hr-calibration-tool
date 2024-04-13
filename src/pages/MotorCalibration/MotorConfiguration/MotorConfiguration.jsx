import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import Select from "react-select";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";
import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";
import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";

import rootStore from "stores/root.store";

import styles from "./MotorConfiguration.module.scss";

const MotorConfiguration = observer(() => {
  const { motorsStore, motorConfigurationStore } = rootStore;
  const [motorOptions, setMotorOptions] = useState([]);
  const [selectedMotor, setSelectedMotor] = useState(null);
  const [configurationData, setConfigurationData] = useState([]);
  const motorConfig = motorConfigurationStore.getMotorConfig();

  useEffect(() => {
    const getOptions = async () => {
      const motors = await motorsStore.fetchMotors();
      const options = motors.map((motor) => ({
        label: (
          <div>
            <strong>{`${motor.name}`}</strong>
            <span
              className={styles["motor-description"]}
            >{` - ${motor.description}`}</span>
          </div>
        ),
        value: motor.id,
      }));

      setMotorOptions(options);
      onMotorSelect(options?.[0] || null);
    };

    getOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!motorConfig) {
      return;
    }

    setConfigurationData([
      {
        description: motorConfig.neutralPosition.description,
        images: motorConfig.neutralPosition.imageUrls,
        title: "Neutral position",
      },
      {
        description: motorConfig.minPosition.description,
        images: motorConfig.minPosition.imageUrls,
        title: "Minimum position",
      },
      {
        description: motorConfig.maxPosition.description,
        images: motorConfig.maxPosition.imageUrls,
        title: "Maximum position",
      },
    ]);
  }, [motorConfig]);

  const onMotorSelect = async (selectedOption) => {
    setSelectedMotor(selectedOption);
    motorConfigurationStore.fetchMotor(selectedOption.value);
  };

  if (!selectedMotor) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles["config-container"]}>
        <div className={styles["config-internal-container"]}>
          <div className={styles["select-container"]}>
            <Select
              onChange={onMotorSelect}
              options={motorOptions}
              value={selectedMotor}
            />
          </div>
          <div className={styles.configs}>
            {configurationData.map((configuration) => (
              <ConfigurationSection
                description={configuration.description}
                images={configuration.images}
                key={configuration.title}
                title={configuration.title}
              >
                <ConfigurationControls />
              </ConfigurationSection>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
});

export default MotorConfiguration;
