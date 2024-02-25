import React, { useState } from "react";

import Select from "react-select";

import { MOTORS } from "constants/motors";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";
import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";
import Footer from "pages/MotorCalibration/MotorConfiguration/Footer";

import styles from "./MotorConfiguration.module.scss";

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

const SAMPLE_IMAGES = [
  "https://placehold.co/600?text=Reference+image\\n600+x+600",
];

const CONFIGURATIONS = [
  {
    description: LOREM_IPSUM,
    images: SAMPLE_IMAGES,
    title: "Neutral position",
  },
  {
    description: LOREM_IPSUM,
    images: SAMPLE_IMAGES,
    title: "Minimum position",
  },
  {
    description: LOREM_IPSUM,
    images: SAMPLE_IMAGES,
    title: "Maximum position",
  },
];

const MOTOR_OPTIONS = MOTORS.map((motor) => ({
  label: motor.name,
  value: motor.name,
}));

const MotorConfiguration = () => {
  const [selectedMotor, setSelectedMotor] = useState(MOTOR_OPTIONS[0]);

  return (
    <div className={styles.container}>
      <div className={styles["config-container"]}>
        <div className={styles["config-internal-container"]}>
          <div className={styles["select-container"]}>
            <Select
              onChange={setSelectedMotor}
              options={MOTOR_OPTIONS}
              value={selectedMotor}
            />
          </div>
          <div className={styles.configs}>
            {CONFIGURATIONS.map((configuration) => (
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
};

export default MotorConfiguration;
