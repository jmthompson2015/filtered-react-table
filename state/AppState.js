const AppState = {};

AppState.create = ({
  filteredTableRows = [],
  filters = [],
  tableColumns = [],
  tableRows = []
} = {}) =>
  Immutable({
    filteredTableRows,
    filters,
    tableColumns,
    tableRows
  });

Object.freeze(AppState);

export default AppState;
