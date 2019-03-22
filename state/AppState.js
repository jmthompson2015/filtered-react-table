const AppState = {};

AppState.create = ({
  filteredTableRows = [],
  filters = [],
  tableColumns = [],
  tableRows = []
} = {}) => ({
  filteredTableRows,
  filters,
  tableColumns,
  tableRows
});

Object.freeze(AppState);

export default AppState;
