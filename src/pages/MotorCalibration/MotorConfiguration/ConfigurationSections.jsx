import React from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import classNames from "classnames";

import ConfigurationControls from "components/ConfigurationControls/ConfigurationControls";
import ConfigurationInstructions from "components/ConfigurationInstructions/ConfigurationInstructions";

import { getSectionData } from "pages/MotorCalibration/MotorConfiguration/utils";

import rootStore from "stores/root.store";

import styles from "./ConfigurationSections.module.scss";

const ConfigurationSections = observer(({ description }) => {
  const { uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { watch } = useFormContext();
  const neutralPositionValue = watch("neutralPositionValue");
  const readDisabled = !uiConfigurationStore.getEnableTorque();

  if (!description) {
    return null;
  }

  return (
    <div className={styles.container}>
      {getSectionData(description, neutralPositionValue).map((position) => (
        <div key={position.prop}>
          <ConfigurationInstructions
            className={styles.instructions}
            description={position.configInstructions}
            images={position.images}
            onScreenChange={(isFullscreen) => {
              uiConfigurationStore.setFullscreen(
                isFullscreen ? position.prop : null,
              );
            }}
            title={position.title}
          />
          <ConfigurationControls
            className={classNames({
              [styles.fullscreen]:
                uiConfigurationStore.getFullscreen() === position.prop,
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
        </div>
      ))}
    </div>
  );
});

export default ConfigurationSections;
