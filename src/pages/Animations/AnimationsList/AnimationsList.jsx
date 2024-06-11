import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";

import Spinner from "react-bootstrap/Spinner";

import EditIconField from "components/Table/EditIconField/EditIconField";
import RenderWithLoader from "components/RenderWithLoader/RenderWithLoader";
import SearchBar from "components/SearchBar/SearchBar";
import Table from "components/Table/Table";

import { DESCRIPTION_TYPES, MODEL_NAME } from "constants/descriptions";
import { FUNCTIONS } from "constants/mongo";

import rootStore from "stores/root.store";

import styles from "./AnimationsList.module.scss";

const TABLE_HEADERS = [
  { key: "name", label: "Name" },
  { key: "action", label: "", className: styles["action-column"] },
];

const AnimationsList = observer(({ actionLink, descriptionItemType }) => {
  const { descriptionStore } = rootStore;
  const [animations, setAnimations] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getAnimations = async () => {
      const description = await descriptionStore.getOrFetchDescription(
        DESCRIPTION_TYPES.ANIMATIONS,
        MODEL_NAME,
      );
      return description?.animations || [];
    };

    const updateTable = async () => {
      let animations = await getAnimations();
      animations = animations.filter(
        ({ type }) => type === descriptionItemType,
      );
      if (searchInput) {
        animations = animations.filter(({ name }) =>
          name.toLowerCase().includes(searchInput.toLowerCase()),
        );
      }
      setAnimations(animations);
    };

    updateTable();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const rows = animations.map(({ name }) => {
    return {
      name,
      action: (
        <EditIconField
          redirect={actionLink}
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
          dependencies={[FUNCTIONS.ANIMATIONS_DESCRIPTIONS.GET_BY_MODEL_NAME]}
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
