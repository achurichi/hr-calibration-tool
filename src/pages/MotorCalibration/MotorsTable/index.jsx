import React from "react";
import Table from "react-bootstrap/Table";
import { BsPencil } from "react-icons/bs";

import { MOTORS } from "../../../constants/motors";

import ClickableIcon from "../../../components/ClickableIcon";

const MotorsTable = () => {
  const items = MOTORS.map((item) => {
    return {
      ...item,
      action: (
        <ClickableIcon>
          <BsPencil />
        </ClickableIcon>
      ),
    };
  });

  return (
    <Table hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Group</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.group}</td>
            <td>{item.action}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default MotorsTable;
