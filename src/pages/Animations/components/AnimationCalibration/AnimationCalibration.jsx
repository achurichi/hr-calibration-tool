import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import useConfigurableItems from "hooks/useConfigurableItems";

import Spinner from "react-bootstrap/Spinner";

import CreateConfiguration from "pages/components/CreateConfiguration/CreateConfiguration";
import EditIconField from "components/Table/EditIconField/EditIconField";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./AnimationCalibration.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name" },
  { key: "action", label: "", className: styles["action-column"] },
];

const AnimationCalibration = observer(({ actionLink, descriptionItemType }) => {
  const { robotStore } = rootStore;
  const configurableAnimations = useConfigurableItems(
    DESCRIPTION_TYPES.ANIMATIONS,
  );
  const [animations, setAnimations] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const missingConfigurations = robotStore.checkMissingConfigurations();

  useEffect(() => {
    let animations = configurableAnimations;
    animations = animations.filter(({ type }) => type === descriptionItemType);

    if (searchInput) {
      animations = animations.filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase()),
      );
    }

    setAnimations(animations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configurableAnimations, searchInput]);

  const rows = animations.map(({ id, name }) => {
    return {
      name,
      action: (
        <EditIconField
          redirect={`${actionLink}/${id}`}
          tooltipContent="Edit configuration"
        />
      ),
    };
  });

  if (missingConfigurations) {
    return <CreateConfiguration />;
  }

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <SearchBar placeholder="Search by Name" onChange={setSearchInput} />
        <RenderWithLoader
          dependencies={[
            FUNCTIONS.ANIMATIONS_DESCRIPTION.GET_BY_NAME,
            FUNCTIONS.ANIMATIONS_CONFIGURATION.GET_BY_DESCRIPTION_AND_ASSEMBLY,
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

export default AnimationCalibration;
