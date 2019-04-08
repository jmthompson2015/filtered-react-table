const TableColumnUtilities = {};

TableColumnUtilities.determineCell = (column, row) =>
  row[`frt-cell-${column.key}`] || TableColumnUtilities.determineValue(column, row);

TableColumnUtilities.determineValue = (column, row) =>
  row[`frt-value-${column.key}`] || row[column.key];

TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
  const columns = R.filter(c => c.key === columnKey, tableColumns);

  return columns.length > 0 ? columns[0] : undefined;
};

Object.freeze(TableColumnUtilities);

export default TableColumnUtilities;
