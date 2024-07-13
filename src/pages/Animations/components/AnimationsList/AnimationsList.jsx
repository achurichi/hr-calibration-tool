import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import useConfigurableItems from "hooks/useConfigurableItems";

import Spinner from "react-bootstrap/Spinner";

import EditIconField from "components/Table/EditIconField/EditIconField";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import styles from "./AnimationsList.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name" },
  { key: "action", label: "", className: styles["action-column"] },
];

const AnimationsList = observer(({ actionLink, descriptionItemType }) => {
  const configurableAnimations = useConfigurableItems(
    DESCRIPTION_TYPES.ANIMATIONS,
  );
  const [animations, setAnimations] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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

  return (
    <div className={styles.container}>
      <div className={styles["internal-container"]}>
        <SearchBar placeholder="Search by Name" onChange={setSearchInput} />
        <RenderWithLoader
          dependencies={[FUNCTIONS.ANIMATIONS_DESCRIPTION.GET_BY_NAME]}
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

export default AnimationsList;
