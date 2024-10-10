import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import ReactTable from 'react-bootstrap/Table';

import styles from './Table.module.scss';

const Table = ({ bordered = true, className, headers = [], rows = [], striped = true, ...props }) => {
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
  const hasRows = !isEmpty(contentRows);

  return (
    <div className={classNames({ [styles.border]: bordered })}>
      <ReactTable className={classNames(styles.table, className)} striped={hasRows && striped} {...props}>
        <thead>
          <tr>{headerCells}</tr>
        </thead>
        <tbody>
          {hasRows && contentRows}
          {!hasRows && (
            <tr className={styles.empty}>
              <td colSpan={100}>Nothing to show...</td>
            </tr>
          )}
        </tbody>
      </ReactTable>
    </div>
  );
};

export default Table;
