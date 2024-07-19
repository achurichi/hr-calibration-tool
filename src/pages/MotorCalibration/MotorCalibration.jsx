import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import useConfigurableItems from "hooks/useConfigurableItems";

import Spinner from "react-bootstrap/Spinner";

import CreateConfiguration from "pages/components/CreateConfiguration/CreateConfiguration";
import EditIconField from "components/Table/EditIconField/EditIconField";
import EmptyField from "components/Table/EmptyField/EmptyField";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FILTER_IDS } from "constants/filters";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorCalibration.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name", className: styles["id-column"] },
  { key: "description", label: "Description" },
  { key: "group", label: "Group" },
  { key: "assembly", label: "Assembly" },
  { key: "action", label: "", className: styles["action-column"] },
];

const MotorCalibration = observer(() => {
  const { filtersStore, robotStore } = rootStore;
  const configurableMotors = useConfigurableItems(DESCRIPTION_TYPES.MOTORS);
  const [motors, setMotors] = useState([]);
  const searchFilter = filtersStore.getFilter(FILTER_IDS.MOTOR_SEARCH);
  const selectedGroup = filtersStore.getFilter(FILTER_IDS.SELECTED_GROUP);
  const selectedAssembly = filtersStore.getFilter(FILTER_IDS.SELECTED_ASSEMBLY);
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    let motors = configurableMotors;

    if (searchFilter) {
      motors = motors.filter(
        ({ name, description }) =>
          name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          description?.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }

    if (selectedGroup) {
      motors = motors.filter(({ group }) => group === selectedGroup);
    }

    if (selectedAssembly) {
      motors = motors.filter(({ assembly }) => assembly === selectedAssembly);
    }

    setMotors(motors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configurableMotors, selectedAssembly, searchFilter, selectedGroup]);

  if (missingConfigurations) {
    return <CreateConfiguration />;
  }

  const rows = motors.map(({ assembly, description, group, id, name }) => {
    return {
      name,
      description: description || <EmptyField text="No description" />,
      group: group || <EmptyField text="No group" />,
      assembly: assembly,
      action: (
        <EditIconField
          redirect={`${PATHS.MOTOR_CONFIGURE}/${id}`}
          tooltipContent="Edit configuration"
        />
      ),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <MotorsFilter motors={configurableMotors} />
        <RenderWithLoader
          dependencies={[
            FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_NAME,
            FUNCTIONS.MOTORS_CONFIGURATION.GET_BY_DESCRIPTION_AND_ASSEMBLY,
          ]}
          loadingComponent={
            <div className={styles["loader-container"]}>
              <Spinner variant="primary" />
            </div>
          }
        >
          <Table headers={TABLE_HEADERS} hover rows={rows} />
        </RenderWithLoader>
      </div>
    </div>
  );
});

export default MotorCalibration;
