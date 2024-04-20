import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

import Spinner from "react-bootstrap/Spinner";
import { BsPencil } from "react-icons/bs";

import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Table from "components/Table/Table";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";

import { FILTER_IDS } from "constants/filters";
import { FUNCTIONS } from "constants/mongo";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorCalibration.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name", className: styles["id-column"] },
  { key: "description", label: "Description" },
  { key: "groupName", label: "Group" },
  { key: "action", label: "", className: styles["action-column"] },
];

const MotorCalibration = observer(() => {
  const { filtersStore, motorsStore } = rootStore;
  const navigate = useNavigate();
  const [motors, setMotors] = useState([]);
  const searchFilter = filtersStore.getFilter(FILTER_IDS.MOTOR_SEARCH);
  const selectedGroup = filtersStore.getFilter(FILTER_IDS.SELECTED_GROUP);

  useEffect(() => {
    const getMotors = async () => {
      setMotors(await motorsStore.fetchMotors(selectedGroup?.id, searchFilter));
    };

    getMotors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchFilter, selectedGroup]);

  const rows = motors.map((item) => {
    return {
      ...item,
      action: (
        <ClickableIcon>
          <BsPencil onClick={() => navigate(PATHS.MOTOR_CONFIGURE)} />
        </ClickableIcon>
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
