import React from "react";
import ReactTable from "react-bootstrap/Table";

const Table = ({ headers = {}, rows = {}, ...props }) => {
  const headerKeys = Object.keys(headers);
  const headerCells = [];
  for (const key of headerKeys) {
    const label = headers[key];
    headerCells.push(<th key={key}>{label}</th>);
  }

  const contentRows = [];
  for (const [rowIndex, item] of rows.entries()) {
    const cells = [];
    for (const [cellIndex, key] of headerKeys.entries()) {
      cells.push(<td key={`row-${rowIndex}-${cellIndex}`}>{item[key]}</td>);
    }
    contentRows.push(<tr key={`row-${rowIndex}`}>{cells}</tr>);
  }

  return (
    <ReactTable {...props}>
      <thead>
        <tr>{headerCells}</tr>
      </thead>
      <tbody>{contentRows}</tbody>
    </ReactTable>
  );
};

export default Table;
