import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useForm, FormProvider } from 'react-hook-form';

import useConfigurationFormSetup from '@/hooks/useConfigurationFormSetup';

import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

import ConfigurationFooter from '@/pages/components/ConfigurationFooter/ConfigurationFooter';
import ConfigurationInstructions from '@/components/ConfigurationInstructions/ConfigurationInstructions';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import Layout from '@/components/Layout/Layout';
import MotionsControls from '@/pages/Animations/components/AnimationConfiguration/MotionsControls';
import RenderWithLoader from '@/components/RenderWithLoader/RenderWithLoader';
import Spinner from '@/components/Spinner/Spinner';

import { DESCRIPTION_TYPES } from '@/constants/descriptions';
import { REQUEST_IDS as ANIMATIONS_CONFIGURATIONS_REQUESTS } from '@/apis/calibrationTool/configurations/animations/animationsApi';
import { REQUEST_IDS as ANIMATIONS_DESCRIPTIONS_REQUESTS } from '@/apis/calibrationTool/descriptions/animations/animationsApi';

import rootStore from '@/stores/root.store';

// not using modules because we want to target the fullscreen carousel class
import './AnimationConfiguration.scss';

const AnimationConfiguration = observer(({ animationType }) => {
  const { configurationStore, requestStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { animationId } = useParams();
  const methods = useForm();
  const selectedAnimationDescription = useConfigurationFormSetup(
    DESCRIPTION_TYPES.ANIMATIONS,
    animationType,
    animationId,
    methods
  );
  const selectedOption = uiConfigurationStore.getSelectedOption();
  const mainRef = useRef(null);

  // scroll to top when animation changes
  useEffect(() => {
    mainRef?.current?.scrollTo(0, 0);
  }, [animationId]);

  const descriptionName = selectedAnimationDescription?.name;
  const configurationName = configurationStore.getItem(selectedAnimationDescription?.id)?.animationName;
  const showNameAlert = descriptionName && configurationName && descriptionName !== configurationName;

  return (
    <>
      <FormProvider {...methods}>
        <Layout>
          <Layout.Topbar>
            <Select
              className="animation-configuration-select"
              isDisabled={requestStore.isLoading(ANIMATIONS_CONFIGURATIONS_REQUESTS.SAVE_CONFIGURATION_ITEM)}
              onChange={(option) => {
                uiConfigurationStore.confirmIfDirty(() => uiConfigurationStore.setSelectedOption(option));
              }}
              options={uiConfigurationStore.getOptions()}
              placeholder="Loading..."
              value={selectedOption}
            />
            {showNameAlert && (
              <Alert className="animation-configuration-alert" variant="warning">
                <b>{configurationName}</b> was renamed to <b>{descriptionName}</b>. Please save to update the
                configuration.
              </Alert>
            )}
            {!!selectedAnimationDescription && (
              <ConfigurationInstructions
                className="animation-configuration-instructions"
                description={selectedAnimationDescription.configInstructions}
                images={selectedAnimationDescription.images}
                onScreenChange={uiConfigurationStore.setFullscreen}
              />
            )}
          </Layout.Topbar>
          <Layout.Main ref={mainRef}>
            <RenderWithLoader
              dependencies={[
                ANIMATIONS_CONFIGURATIONS_REQUESTS.GET_BY_DESCRIPTION_AND_ASSEMBLY,
                ANIMATIONS_DESCRIPTIONS_REQUESTS.GET_BY_NAME,
              ]}
              loadingComponent={<Spinner className="animation-configuration-spinner" />}
            >
              <Form>
                <MotionsControls description={selectedAnimationDescription} />
              </Form>
            </RenderWithLoader>
          </Layout.Main>
          <Layout.Footer>
            <ConfigurationFooter
              checkboxProps={{
                id: 'preview-robot',
                label: 'Preview on the robot',
                onChange: ({ target }) => {
                  uiConfigurationStore.setPreviewOnRobot(target.checked);
                  const animation = methods.getValues();
                  uiConfigurationStore.setPositionsForAnimation(animation);
                },
              }}
              showMotorCurrentPositiom={false}
            />
          </Layout.Footer>
        </Layout>
      </FormProvider>
      <ConfirmationModal {...uiConfigurationStore.getUnsavedModalConfig()} />
    </>
  );
});

export default AnimationConfiguration;
