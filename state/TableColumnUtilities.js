const TableColumnUtilities = {};

TableColumnUtilities.determineValue = (column, row) =>
  column.valueFunction ? column.valueFunction(row) : row[column.key];

TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
  const columns = R.filter(c => c.key === columnKey, tableColumns);

  return columns.length > 0 ? columns[0] : undefined;
};

Object.freeze(TableColumnUtilities);

export default TableColumnUtilities;
