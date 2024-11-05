import { observer } from 'mobx-react';
import classNames from 'classnames';

import ConfigurationControls from '@/components/ConfigurationControls/ConfigurationControls';

import rootStore from '@/stores/root.store';

import styles from './MotionsControls.module.scss';

const MotionsControls = observer(({ description }) => {
  const { uiStore, rosStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const fullscreen = uiConfigurationStore.getFullscreen();

  if (!description) {
    return null;
  }

  const motions = description.motions.map((motion, index) => ({
    title: motion.description,
    maxValue: motion.maxValue,
    minValue: motion.minValue,
    name: motion.name,
    id: motion.id,
    prop: `motions.${index}.value`,
  }));

  return (
    <div
      className={classNames(styles.controls, {
        [styles.fullscreen]: fullscreen,
      })}
    >
      {motions.map((motion) => (
        <ConfigurationControls
          configurationId={motion.id}
          inline={!fullscreen}
          key={motion.id}
          max={motion.maxValue}
          maxAllowed={motion.maxValue}
          min={motion.minValue}
          minAllowed={motion.minValue}
          name={motion.prop}
          onValueChange={(value) => {
            if (rosStore.getPreviewOnRobot() && value >= motion.minValue && value <= motion.maxValue) {
              rosStore.setMotionPosition(description.name, motion.name, value);
            }
          }}
          step={0.01}
          title={motion.title}
        />
      ))}
    </div>
  );
});

export default MotionsControls;
