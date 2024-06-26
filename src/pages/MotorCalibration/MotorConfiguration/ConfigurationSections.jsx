import React from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import classNames from "classnames";

import ConfigurationControls from "components/ConfigurationSection/ConfigurationControls";
import ConfigurationSection from "components/ConfigurationSection/ConfigurationSection";

import { getSectionData } from "pages/MotorCalibration/MotorConfiguration/utils";

import rootStore from "stores/root.store";

import styles from "./ConfigurationSections.module.scss";

const ConfigurationSections = observer(({ className, description }) => {
  const { uiStore } = rootStore;
  const { uiMotorsConfigurationStore } = uiStore;
  const { watch } = useFormContext();
  const neutralPositionValue = watch("neutralPositionValue");
  const readDisabled = !uiMotorsConfigurationStore.getEnableTorque();

  if (!description) {
    return null;
  }

  return (
    <div className={className}>
      {getSectionData(description, neutralPositionValue).map((position) => (
        <ConfigurationSection
          className={styles.section}
          description={position.configInstructions}
          images={position.images}
          key={position.prop}
          onScreenChange={(isFullscreen) => {
            uiMotorsConfigurationStore.setFullscreen(
              isFullscreen ? position.prop : null,
            );
          }}
          title={position.title}
        >
          <ConfigurationControls
            className={classNames({
              [styles.fullscreen]:
                uiMotorsConfigurationStore.getFullscreen() === position.prop,
            })}
            configurationId={description.id}
            extraButtons={[
              {
                disabled: readDisabled,
                label: "Read",
                onClick: () => {}, // TODO: implement read motor current position
                tooltipProps: {
                  content: readDisabled
                    ? "Enable torque to read motor current position"
                    : "Read motor current position",
                  id: "read-configuration",
                },
              },
            ]}
            max={position.maxValue}
            maxAllowed={description.maxValue}
            min={position.minValue}
            minAllowed={description.minValue}
            name={position.prop}
          />
        </ConfigurationSection>
      ))}
    </div>
  );
});

export default ConfigurationSections;
