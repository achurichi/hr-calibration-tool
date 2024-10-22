import { observer } from 'mobx-react';

import Form from 'react-bootstrap/Form';

import Footer from '@/components/Footer/Footer';
import ProgressBar from '@/components/ProgressBar/ProgressBar';

import { REQUEST_IDS as MOTORS_CONFIGURATIONS_REQUESTS } from '@/apis/calibrationTool/configurations/motors/motorsApi';

import rootStore from '@/stores/root.store';

import styles from './ConfigurationFooter.module.scss';

const ConfigurationFooter = observer(({ checkboxProps, showMotorData }) => {
  const { requestStore, rosStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const saveDisabledReason = uiConfigurationStore.getSaveDisabledReason();
  const saving = requestStore.isLoading(MOTORS_CONFIGURATIONS_REQUESTS.SAVE_CONFIGURATION_ITEM);
  const motorId = uiConfigurationStore.getMotorIdForSelectedOption();
  const motorPosition = rosStore.getMotorPosition(motorId);
  const motorLoad = rosStore.getMotorLoad(motorId);

  return (
    <Footer
      buttons={[
        {
          disabled: saveDisabledReason || saving,
          label: 'Save',
          onClick: uiConfigurationStore.saveConfiguration,
          separator: true,
          tooltipProps: {
            content: saveDisabledReason,
            id: 'save-configuration',
          },
        },
        {
          disabled: uiConfigurationStore.prevDisabled() || saving,
          label: 'Previous',
          onClick: () => {
            uiConfigurationStore.confirmIfDirty(() => uiConfigurationStore.prevItem());
          },
        },
        {
          disabled: uiConfigurationStore.nextDisabled() || saving,
          label: 'Next',
          onClick: () => {
            uiConfigurationStore.confirmIfDirty(() => uiConfigurationStore.nextItem());
          },
        },
      ]}
    >
      {checkboxProps && (
        <Form className={styles.form}>
          <Form.Check
            disabled={!uiConfigurationStore.getSelectedOption() || saving}
            type="checkbox"
            {...checkboxProps}
          />
        </Form>
      )}
      {showMotorData && (
        <>
          <ProgressBar
            containerClassName={styles['current-position']}
            now={motorPosition}
            showCurrentValue
            topLabel="Motor current position"
          />
          <ProgressBar containerClassName={styles['motor-load']} now={motorLoad} topLabel="Motor load" />
        </>
      )}
    </Footer>
  );
});

export default ConfigurationFooter;
