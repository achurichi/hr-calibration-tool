import React, { useEffect, useState, useRef } from "react";
import { observer } from "mobx-react";

import Spinner from "react-bootstrap/Spinner";
import { AutoForm, ErrorsField, SubmitField } from "uniforms-bootstrap5";

import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";

import useCallWithNotification from "hooks/useCallWithNotification";
import useSchema from "pages/Admin/schemas/useSchema";

import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import { cleanObject } from "utilities/objects";

import {
  DESCRIPTION_TYPES,
  DESCRIPTION_TYPES_MAP,
  MODEL_NAME,
  NEW_ITEM_OPTION,
} from "constants/descriptions";

import ConfigurationBar from "pages/Admin/ConfigurationBar";
import DataForm from "pages/Admin/Forms/DataForm";

import styles from "./Admin.module.scss";

const Admin = observer(() => {
  const { descriptionStore, uiStore } = rootStore;
  const { uiDescriptionStore } = uiStore;
  const callWithNotification = useCallWithNotification();
  const { schema, defaultForm } = useSchema();
  const formRef = useRef();
  const [formData, setFormData] = useState({});
  const selectedConfiguration = uiDescriptionStore.getSelectedConfiguration();
  const selectedItem = uiDescriptionStore.getSelectedItem();

  useEffect(() => {
    return () => {
      uiDescriptionStore.clear();
      descriptionStore.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setFormData(defaultForm);
  }, [defaultForm]);

  useEffect(() => {
    const configureDescription = async () => {
      if (!selectedConfiguration) {
        return;
      }

      uiDescriptionStore.setEditDisabled(true);

      const descriptionType =
        DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
      const description = descriptionStore.getDescription(descriptionType);

      if (!description) {
        await descriptionStore.fetchDescription(descriptionType, MODEL_NAME);
      }

      uiDescriptionStore.setSelectedItem(
        uiDescriptionStore.getItemOptions()[0],
      );

      uiDescriptionStore.setEditDisabled(false);
    };

    configureDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConfiguration]);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    formRef?.current?.reset();

    if (selectedItem.value === NEW_ITEM_OPTION.value) {
      setFormData(defaultForm);
      return;
    }

    const item = descriptionStore.getItemById(
      selectedItem.value,
      selectedConfiguration.value,
    );
    setFormData(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const onSubmit = async (data) => {
    uiDescriptionStore.setEditDisabled(true);

    const descriptionType = DESCRIPTION_TYPES_MAP[selectedConfiguration.value];
    const saveFn = async () => {
      await descriptionStore.saveItem(
        descriptionType,
        MODEL_NAME,
        cleanObject(data),
      );
    };
    const fnId =
      descriptionType === DESCRIPTION_TYPES.MOTORS
        ? FUNCTIONS.MOTORS_DESCRIPTIONS.SAVE_ITEM
        : FUNCTIONS.ANIMATIONS_DESCRIPTIONS.SAVE_ITEM;

    await callWithNotification(saveFn, fnId, "Configuration saved");
    uiDescriptionStore.setSelectedItemByName(data.name);
    uiDescriptionStore.setEditDisabled(false);
  };

  return (
    <div className={styles.container}>
      <ConfigurationBar />
      <RenderWithLoader
        dependencies={[
          FUNCTIONS.MOTORS_DESCRIPTIONS.GET_BY_MODEL_NAME,
          FUNCTIONS.ANIMATIONS_DESCRIPTIONS.GET_BY_MODEL_NAME,
        ]}
        loadingComponent={
          <div className={styles["loader-container"]}>
            <Spinner variant="primary" />
          </div>
        }
      >
        {selectedItem && (
          <AutoForm
            className={styles["auto-form"]}
            model={formData}
            onChangeModel={(model) => setFormData(model)}
            onSubmit={onSubmit}
            ref={formRef}
            schema={schema}
          >
            <div className={styles["form-container"]}>
              <DataForm />
              <ErrorsField />
            </div>
            <div className={styles.footer}>
              <SubmitField
                disabled={uiDescriptionStore.getEditDisabled()}
                value="Save"
              />
            </div>
          </AutoForm>
        )}
      </RenderWithLoader>
    </div>
  );
});

export default Admin;
