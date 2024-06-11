import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";
import { BsPencil } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Table from "components/Table/Table";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";

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
  const navigate = useNavigate();
  const [motors, setMotors] = useState([]);
  const searchFilter = filtersStore.getFilter(FILTER_IDS.MOTOR_SEARCH);
  const selectedGroup = filtersStore.getFilter(FILTER_IDS.SELECTED_GROUP);

  useEffect(() => {
    const getMotors = async () => {
      let description = descriptionStore.getDescription(
        DESCRIPTION_TYPES.MOTORS,
      );
      if (!description) {
        description = await descriptionStore.fetchDescription(
          DESCRIPTION_TYPES.MOTORS,
          MODEL_NAME,
        );
      }
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

  const rows = motors.map(({ name, description, group }) => {
    return {
      name,
      description: description || (
        <div className={styles["not-available"]}>No description</div>
      ),
      group: group || <div className={styles["not-available"]}>No group</div>,
      action: (
        <ClickableIcon
          tooltipProps={{
            content: "Edit configuration",
          }}
          Icon={BsPencil}
          onClick={() => navigate(PATHS.MOTOR_CONFIGURE)}
        />
      ),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <MotorsFilter />
        <RenderWithLoader
          dependencies={[FUNCTIONS.MOTORS.GET_ALL, FUNCTIONS.GROUPS.GET_ALL]}
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
