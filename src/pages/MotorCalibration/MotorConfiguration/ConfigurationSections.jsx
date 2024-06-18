import React from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import classNames from "classnames";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";
import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";

import { positionsFromDescription } from "pages/MotorCalibration/MotorConfiguration/utils";

import rootStore from "stores/root.store";

import styles from "./ConfigurationSections.module.scss";

const ConfigurationSections = observer(
  ({ className, configuration, description }) => {
    const { uiStore } = rootStore;
    const { uiMotorsConfigurationStore } = uiStore;
    const { watch } = useFormContext();
    const neutralPositionValue = watch("neutralPositionValue");

    if (!description) {
      return null;
    }

    return (
      <div className={className}>
        {positionsFromDescription(description, neutralPositionValue).map(
          (position) => (
            <ConfigurationSection
              className={styles.section}
              description={position.configInstructions}
              images={position.images}
              key={position.prop}
              prop={position.prop}
              title={position.title}
            >
              <ConfigurationControls
                className={classNames({
                  [styles.fullscreen]:
                    uiMotorsConfigurationStore.getFullscreen() ===
                    position.prop,
                })}
                defaultValue={position.defaultValue}
                max={position.maxValue}
                maxAllowed={description.maxValue}
                min={position.minValue}
                minAllowed={description.minValue}
                name={position.prop}
              />
            </ConfigurationSection>
          ),
        )}
      </div>
    );
  },
);

export default ConfigurationSections;
