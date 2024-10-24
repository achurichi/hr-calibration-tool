import { useFormContext } from 'react-hook-form';
import { observer } from 'mobx-react';
import classNames from 'classnames';

import Alert from 'react-bootstrap/Alert';

import AdvancedForm from '@/pages/components/Forms/AdvancedForm';
import ConfigurationControls from '@/components/ConfigurationControls/ConfigurationControls';
import ConfigurationInstructions from '@/components/ConfigurationInstructions/ConfigurationInstructions';

import { getSectionData } from '@/pages/MotorCalibration/MotorConfiguration/utils';
import { validateRange } from '@/components/ConfigurationControls/utils';

import rootStore from '@/stores/root.store';

// not using modules because we want to target the fullscreen carousel class
import './ConfigurationSections.scss';

const ConfigurationSections = observer(({ description }) => {
  const { configurationStore, uiStore, rosStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { watch, setValue, trigger } = useFormContext();
  const neutralPositionValue = watch('neutralPositionValue');
  const motorId = uiConfigurationStore.getMotorIdForSelectedOption();

  if (!description) {
    return null;
  }

  const descriptionName = description.name;
  const configurationName = configurationStore.getItem(description.id)?.motorName;
  const showNameAlert = configurationName && descriptionName !== configurationName;

  return (
    <div className="motor-configuration-sections">
      {showNameAlert && (
        <Alert className="alert" variant="warning">
          <b>{configurationName}</b> was renamed to <b>{descriptionName}</b>. Please save to update the configuration.
        </Alert>
      )}
      {getSectionData(description, neutralPositionValue).map((position) => (
        <div key={position.prop}>
          <ConfigurationInstructions
            description={position.configInstructions}
            images={position.images}
            onScreenChange={(isFullscreen) => {
              uiConfigurationStore.setFullscreen(isFullscreen ? position.prop : null);
            }}
            title={position.title}
          />
          <ConfigurationControls
            className={classNames({
              'fullscreen-controls': uiConfigurationStore.getFullscreen() === position.prop,
            })}
            configurationId={description.id}
            extraButtons={[
              {
                label: 'Read',
                onClick: () => {
                  if (motorId) {
                    const positionValue = rosStore.getMotorPosition(motorId);
                    setValue(position.prop, positionValue, { shouldDirty: true });
                    trigger();
                  }
                },
                tooltipProps: {
                  content: 'Read motor current position',
                  id: 'read-configuration',
                },
              },
            ]}
            max={position.maxValue}
            maxAllowed={description.maxValue}
            min={position.minValue}
            minAllowed={description.minValue}
            name={position.prop}
            onValueChange={(value) => {
              if (
                motorId &&
                validateRange(
                  value,
                  position.minValue,
                  position.maxValue,
                  description.minValue,
                  description.maxValue
                ) === true
              ) {
                rosStore.setMotorPosition(motorId, value);
              }
            }}
          />
        </div>
      ))}
      <AdvancedForm />
    </div>
  );
});

export default ConfigurationSections;
