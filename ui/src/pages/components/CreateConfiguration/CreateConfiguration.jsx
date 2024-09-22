import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import isEmpty from "lodash/isEmpty";

import useCallWithNotification from "hooks/useCallWithNotification";

import Select from "react-select";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";

import Button from "components/Button/Button";
import Table from "components/Table/Table";

import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./CreateConfiguration.module.scss";

const TABLE_HEADERS = [
  { key: "assembly", label: "Assembly" },
  { key: "select", label: "Description", className: styles["select-column"] },
];

const CreateConfiguration = observer(() => {
  const { configurationStore, descriptionStore, robotStore, requestStore } =
    rootStore;
  const callWithNotification = useCallWithNotification();
  const [options, setOptions] = useState([]);
  const [selectedDescriptions, setSelectedDescriptions] = useState({});
  const assembliesWithoutDescription =
    robotStore.getAssembliesWithoutDescription();
  const manyConfigurations = assembliesWithoutDescription.length > 1;

  useEffect(() => {
    const fetchOptions = async () => {
      const descriptions = await descriptionStore.fetchDescriptionNames();
      setOptions(descriptions.map((name) => ({ value: name, label: name })));
    };

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedDescriptions = assembliesWithoutDescription.reduce(
      (acc, assembly) => ({ ...acc, [assembly]: undefined }),
      {},
    );
    setSelectedDescriptions(selectedDescriptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, JSON.stringify(assembliesWithoutDescription)]);

  const createConfigurations = async () => {
    const assemblyDescriptionMap = Object.entries(selectedDescriptions).reduce(
      (acc, [assembly, description]) => {
        acc[assembly] = description.value;
        return acc;
      },
      {},
    );

    const { success } = await callWithNotification(
      async () =>
        await configurationStore.createConfigurations(assemblyDescriptionMap),
      FUNCTIONS.CONFIGURATIONS.CREATE_MANY,
      `${manyConfigurations ? "Configurations" : "Configuration"} created`,
    );

    if (success) {
      robotStore.fetchDescriptionNamesByAssembly();
    }
  };

  const rows = assembliesWithoutDescription.map((assembly) => ({
    assembly,
    select: (
      <Select
        onChange={(option) => {
          setSelectedDescriptions({
            ...selectedDescriptions,
            [assembly]: option,
          });
        }}
        options={options}
        value={selectedDescriptions[assembly]}
      />
    ),
  }));

  return (
    <div className={styles.container}>
      <Card>
        <Alert className={styles.alert} variant="warning">
          Please select a description for every assembly.
        </Alert>
        <Table
          bordered={false}
          className={styles.table}
          headers={TABLE_HEADERS}
          rows={rows}
          striped={false}
        />
        <Button
          className={styles["create-button"]}
          disabled={
            isEmpty(selectedDescriptions) ||
            Object.values(selectedDescriptions).some((value) => !value) ||
            requestStore.isLoading(FUNCTIONS.CONFIGURATIONS.CREATE_MANY)
          }
          onClick={createConfigurations}
        >
          {`Create ${manyConfigurations ? "configurations" : "configuration"}`}
        </Button>
      </Card>
    </div>
  );
});

export default CreateConfiguration;
