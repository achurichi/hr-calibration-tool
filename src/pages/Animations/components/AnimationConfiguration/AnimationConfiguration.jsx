import React from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";
import { useForm, FormProvider } from "react-hook-form";

import useConfigurationFormSetup from "hooks/useConfigurationFormSetup";

import Form from "react-bootstrap/Form";
import Select from "react-select";
import Spinner from "react-bootstrap/Spinner";

import ConfigurationFooter from "pages/components/ConfigurationFooter/ConfigurationFooter";
import ConfigurationInstructions from "components/ConfigurationInstructions/ConfigurationInstructions";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import Layout from "components/Layout/Layout";
import MotionsControls from "pages/Animations/components/AnimationConfiguration/MotionsControls";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

// not using modules because we want to target the fullscreen carousel class
import "./AnimationConfiguration.scss";

const AnimationConfiguration = observer(({ animationType }) => {
  const { statusStore, uiStore } = rootStore;
  const { uiConfigurationStore } = uiStore;
  const { animationId } = useParams();
  const methods = useForm();
  const selectedAnimationDescription = useConfigurationFormSetup(
    DESCRIPTION_TYPES.ANIMATIONS,
    animationType,
    animationId,
    methods,
  );
  const selectedOption = uiConfigurationStore.getSelectedOption();

  return (
    <>
      <FormProvider {...methods}>
        <Layout>
          <Layout.Topbar>
            <Select
              className={"animation-configuration-select"}
              isDisabled={statusStore.isLoading(
                FUNCTIONS.ANIMATIONS_CONFIGURATION.SAVE_ITEM,
              )}
              onChange={(option) => {
                uiConfigurationStore.confirmIfDirty(() =>
                  uiConfigurationStore.setSelectedOption(option),
                );
              }}
              options={uiConfigurationStore.getOptions()}
              placeholder="Loading..."
              value={selectedOption}
            />
            {!!selectedAnimationDescription && (
              <ConfigurationInstructions
                className={"animation-configuration-instructions"}
                description={selectedAnimationDescription.configInstructions}
                images={selectedAnimationDescription.images}
                onScreenChange={uiConfigurationStore.setFullscreen}
              />
            )}
          </Layout.Topbar>
          <Layout.Main>
            <RenderWithLoader
              dependencies={[
                FUNCTIONS.ANIMATIONS_CONFIGURATION
                  .GET_BY_DESCRIPTION_AND_ASSEMBLY,
                FUNCTIONS.ANIMATIONS_DESCRIPTION.GET_BY_NAME,
              ]}
              loadingComponent={
                <div className={"animation-configuration-loader-container"}>
                  <Spinner variant="primary" />
                </div>
              }
            >
              <Form>
                <MotionsControls description={selectedAnimationDescription} />
              </Form>
            </RenderWithLoader>
          </Layout.Main>
          <Layout.Footer>
            <ConfigurationFooter
              checkboxProps={{
                id: "preview-robot",
                label: "Preview on the robot",
                onChange: uiConfigurationStore.setPreviewOnRobot,
              }}
              descriptionType={DESCRIPTION_TYPES.ANIMATIONS}
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
