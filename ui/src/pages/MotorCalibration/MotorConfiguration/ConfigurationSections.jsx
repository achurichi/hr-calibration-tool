import React from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import classNames from "classnames";

import Alert from "react-bootstrap/Alert";

import AdvancedForm from "@/pages/components/Forms/AdvancedForm";
import ConfigurationControls from "@/components/ConfigurationControls/ConfigurationControls";
import ConfigurationInstructions from "@/components/ConfigurationInstructions/ConfigurationInstructions";

import { getSectionData } from "@/pages/MotorCalibration/MotorConfiguration/utils";

import rootStore from "@/stores/root.store";

// not using modules because we want to target the fullscreen carousel class
import "./ConfigurationSections.scss";

const ConfigurationSections = observer(({ description }) => {
  const { configurationStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { watch } = useFormContext();
  const neutralPositionValue = watch("neutralPositionValue");

  if (!description) {
    return null;
  }

  const descriptionName = description.name;
  const configurationName = configurationStore.getItem(
    description.id,
  )?.motorName;
  const showNameAlert =
    configurationName && descriptionName !== configurationName;

  return (
    <div className="motor-configuration-sections">
      {showNameAlert && (
        <Alert className="alert" variant="warning">
          <b>{configurationName}</b> was renamed to <b>{descriptionName}</b>.
          Please save to update the configuration.
        </Alert>
      )}
      {getSectionData(description, neutralPositionValue).map((position) => (
        <div key={position.prop}>
          <ConfigurationInstructions
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
              "fullscreen-controls":
                uiConfigurationStore.getFullscreen() === position.prop,
            })}
            configurationId={description.id}
            extraButtons={[
              {
                label: "Read",
                onClick: () => {}, // TODO: implement read motor current position and disable when the motor is not connected
                tooltipProps: {
                  content: "Read motor current position",
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
      <AdvancedForm />
    </div>
  );
});

export default ConfigurationSections;
