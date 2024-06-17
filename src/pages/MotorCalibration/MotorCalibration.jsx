import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import Spinner from "react-bootstrap/Spinner";

import EditIconField from "components/Table/EditIconField/EditIconField";
import EmptyField from "components/Table/EmptyField/EmptyField";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES, MODEL_NAME } from "constants/descriptions";
import { FILTER_IDS } from "constants/filters";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorCalibration.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name", className: styles["id-column"] },
  { key: "description", label: "Description" },
  { key: "group", label: "Group" },
  { key: "action", label: "", className: styles["action-column"] },
];

const MotorCalibration = observer(() => {
  const { descriptionStore, filtersStore } = rootStore;
  const [motors, setMotors] = useState([]);
  const searchFilter = filtersStore.getFilter(FILTER_IDS.MOTOR_SEARCH);
  const selectedGroup = filtersStore.getFilter(FILTER_IDS.SELECTED_GROUP);

  useEffect(() => {
    const getMotors = async () => {
      const description = await descriptionStore.getOrFetchDescription(
        DESCRIPTION_TYPES.MOTORS,
        MODEL_NAME,
      );
      return description?.motors || [];
    };

    const updateTable = async () => {
      let motors = await getMotors();
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
      setMotors(motors);
    };

    updateTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter, selectedGroup]);

  const rows = motors.map(({ id, name, description, group }) => {
    return {
      name,
      description: description || <EmptyField text="No description" />,
      group: group || <EmptyField text="No group" />,
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
        <MotorsFilter />
        <RenderWithLoader
          dependencies={[FUNCTIONS.MOTORS_DESCRIPTION.GET_BY_MODEL_NAME]}
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
