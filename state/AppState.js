const AppState = {};

AppState.create = ({
  appName = "FilteredReactTable",
  columnToChecked = {},
  defaultSort = undefined,
  filteredTableRows = [],
  filterGroup = undefined,
  isVerbose = false,
  tableColumns = [],
  tableRows = [],
} = {}) =>
  Immutable({
    appName,
    columnToChecked,
    defaultSort,
    filteredTableRows,
    filterGroup,
    isVerbose,
    tableColumns,
    tableRows,
  });

Object.freeze(AppState);

export default AppState;
