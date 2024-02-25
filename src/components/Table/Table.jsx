import React from "react";
import ReactTable from "react-bootstrap/Table";

const Table = ({ headers = [], rows = [], ...props }) => {
  const headerKeys = headers.map((header) => header.key);
  const headerCells = headers.map(({ key, label, ...props }) => {
    return (
      <th key={key} {...props}>
        {label}
      </th>
    );
  });

  const contentRows = rows.map((row, rowIndex) => {
    return (
      <tr key={`row-${rowIndex}`}>
        {headerKeys.map((key, cellIndex) => {
          return <td key={`row-${rowIndex}-${cellIndex}`}>{row[key]}</td>;
        })}
      </tr>
    );
  });

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
