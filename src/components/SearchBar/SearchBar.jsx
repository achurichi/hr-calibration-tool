import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";

import styles from "./SearchBar.module.scss";

function SearchBar({ placeholder = "Search" }) {
  return (
    <InputGroup>
      <Form.Control placeholder={placeholder} />
      <InputGroup.Text className={styles.icon}>
        <BsSearch />
      </InputGroup.Text>
    </InputGroup>
  );
}

export default SearchBar;
