const AppState = {};

AppState.create = ({
  appName = "FilteredReactTable",
  filteredTableRows = [],
  filters = [],
  isVerbose = false,
  tableColumns = [],
  tableRows = []
} = {}) =>
  Immutable({
    appName,
    filteredTableRows,
    filters,
    isVerbose,
    tableColumns,
    tableRows
  });

Object.freeze(AppState);

export default AppState;
