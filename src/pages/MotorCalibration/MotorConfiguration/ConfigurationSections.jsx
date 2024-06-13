import React from "react";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";
import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";

import {
  buildConfigurationData,
  getSliderMaxValue,
  getSliderMinValue,
} from "pages/MotorCalibration/MotorConfiguration/utils";

import styles from "./ConfigurationSections.module.scss";

const ConfigurationSections = ({
  className,
  editableConfig,
  motorConfig,
  onChange,
}) => {
  if (!editableConfig) {
    return null;
  }

  return (
    <div className={className}>
      {buildConfigurationData(motorConfig).map((config) => (
        <ConfigurationSection
          className={styles.section}
          description={config.description}
          images={config.images}
          key={config.prop}
          title={config.title}
        >
          <ConfigurationControls
            max={getSliderMaxValue(editableConfig, config.prop)}
            min={getSliderMinValue(editableConfig, config.prop)}
            onChange={(value) => onChange(config.prop, value)}
            defaultValue={motorConfig[config.prop].value}
          />
        </ConfigurationSection>
      ))}
    </div>
  );
};

export default ConfigurationSections;
