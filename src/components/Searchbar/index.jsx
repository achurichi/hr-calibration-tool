import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { BsSearch } from "react-icons/bs";

import "./Searchbar.scss";

function Searchbar({ placeholder = "Search" }) {
  return (
    <InputGroup>
      <Form.Control placeholder={placeholder} />
      <InputGroup.Text className="icon">
        <BsSearch />
      </InputGroup.Text>
    </InputGroup>
  );
}

export default Searchbar;
