const AppState = {};

AppState.create = ({
  appName = "FilteredReactTable",
  columnToChecked = {},
  filteredTableRows = [],
  filterGroup = undefined,
  isVerbose = false,
  tableColumns = [],
  tableRows = [],
} = {}) =>
  Immutable({
    appName,
    columnToChecked,
    filteredTableRows,
    filterGroup,
    isVerbose,
    tableColumns,
    tableRows,
  });

Object.freeze(AppState);

export default AppState;
