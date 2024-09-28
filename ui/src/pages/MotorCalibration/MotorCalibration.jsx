import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import useCallWithNotification from "hooks/useCallWithNotification";
import useConfigurableItems from "hooks/useConfigurableItems";

import { BsPlusLg, BsTrash } from "react-icons/bs";

import AddMotorsModal from "pages/MotorCalibration/components/AddMotorsModal/AddMotorsModal";
import Button from "components/Button/Button";
import ClickableIcon from "components/ClickableIcon/ClickableIcon";
import ConfirmationModal from "components/ConfirmationModal/ConfirmationModal";
import CreateConfiguration from "pages/components/CreateConfiguration/CreateConfiguration";
import EditIconField from "components/Table/EditIconField/EditIconField";
import EmptyField from "components/Table/EmptyField/EmptyField";
import MotorsFilter from "pages/MotorCalibration/MotorsFilter";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import Spinner from "components/Spinner/Spinner";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FILTER_IDS } from "constants/filters";
import { REQUEST_IDS as MOTORS_CONFIGURATIONS_REQUESTS } from "apis/calibrationTool/configurations/motors/motorsApi";
import { REQUEST_IDS as MOTORS_DESCRIPTIONS_REQUESTS } from "apis/calibrationTool/descriptions/motors/motorsApi";
import { PATHS } from "constants/routes";

import rootStore from "stores/root.store";

import styles from "./MotorCalibration.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name", className: styles["id-column"] },
  { key: "motorId", label: "Id" },
  { key: "min", label: "Min" },
  { key: "neutral", label: "Neutral" },
  { key: "max", label: "Max" },
  { key: "group", label: "Group" },
  { key: "assembly", label: "Assembly" },
  { key: "action", label: "" },
];

const MotorCalibration = observer(() => {
  const { configurationStore, filtersStore, robotStore, requestStore } =
    rootStore;
  const { configure: configurableMotors, add: addableMotors } =
    useConfigurableItems(DESCRIPTION_TYPES.MOTORS);
  const callWithNotification = useCallWithNotification();
  const [motors, setMotors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [motorToDelete, setMotorToDelete] = useState(null);
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

  const onAddMotors = async (motorsMap) => {
    const { success } = await callWithNotification(
      () => configurationStore.addMotors(motorsMap),
      MOTORS_CONFIGURATIONS_REQUESTS.ADD_ITEMS,
      "Motors added",
    );
    if (success) {
      await configurationStore.getOrFetchAssemblyConfigurations(
        DESCRIPTION_TYPES.MOTORS,
        true,
      );
      setShowAddModal(false);
    }
  };

  const onDeleteMotor = async () => {
    const { success } = await callWithNotification(
      () =>
        configurationStore.deleteMotor(
          motorToDelete.assembly,
          motorToDelete.id,
        ),
      MOTORS_CONFIGURATIONS_REQUESTS.DELETE_ITEM,
      "Motor deleted",
    );
    if (success) {
      setMotorToDelete(null);
    }
  };

  if (missingConfigurations) {
    return <CreateConfiguration />;
  }

  const rows = motors.map((motor) => {
    const { assembly, motorId, group, id, name, min, max, neutral } = motor;
    return {
      name,
      motorId: motorId,
      min: min,
      max: max,
      neutral: neutral,
      group: group || <EmptyField text="No group" />,
      assembly: assembly,
      action: (
        <div className={styles["action-container"]}>
          <EditIconField
            redirect={`${PATHS.MOTOR_CONFIGURE}/${id}`}
            tooltipContent="Edit configuration"
          />
          <ClickableIcon
            color="var(--danger)"
            Icon={BsTrash}
            onClick={() => setMotorToDelete(motor)}
            tooltipProps={{ content: "Delete configuration" }}
          />
        </div>
      ),
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <MotorsFilter motors={configurableMotors} />
        <RenderWithLoader
          dependencies={[MOTORS_DESCRIPTIONS_REQUESTS.GET_BY_NAME]}
          loadingComponent={<Spinner className={styles.spinner} />}
        >
          <Table headers={TABLE_HEADERS} hover rows={rows} />
          <div className={styles["add-button-container"]}>
            <Button
              Icon={BsPlusLg}
              className={styles["add-button"]}
              disabled={!addableMotors.length}
              variant="outline-primary"
              onClick={() => setShowAddModal(true)}
              tooltipProps={{
                content: !addableMotors.length && "All motors have been added",
              }}
            >
              Add motors
            </Button>
          </div>
        </RenderWithLoader>
        <AddMotorsModal
          disabled={requestStore.isLoading([
            MOTORS_CONFIGURATIONS_REQUESTS.ADD_ITEMS,
            MOTORS_CONFIGURATIONS_REQUESTS.GET_BY_DESCRIPTION_AND_ASSEMBLY,
          ])}
          motors={addableMotors}
          onCancel={() => setShowAddModal(false)}
          onConfirm={onAddMotors}
          show={showAddModal}
        />
        <ConfirmationModal
          confirmLabel="Delete"
          confirmVariant="danger"
          disabled={requestStore.isLoading(
            MOTORS_CONFIGURATIONS_REQUESTS.DELETE_ITEM,
          )}
          message={
            <div>
              {"Are you sure you want to delete the configuration for "}
              <strong>{motorToDelete?.name}</strong>?
            </div>
          }
          onCancel={() => setMotorToDelete(null)}
          onConfirm={onDeleteMotor}
          show={!!motorToDelete}
          title="Delete configuration"
        />
      </div>
    </div>
  );
});

export default MotorCalibration;
