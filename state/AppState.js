const AppState = {};

AppState.create = ({
  appName = "FilteredReactTable",
  columnToChecked = {},
  filteredTableRows = [],
  filters = [],
  isVerbose = false,
  tableColumns = [],
  tableRows = []
} = {}) =>
  Immutable({
    appName,
    columnToChecked,
    filteredTableRows,
    filters,
    isVerbose,
    tableColumns,
    tableRows
  });

Object.freeze(AppState);

export default AppState;
