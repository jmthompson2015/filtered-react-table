/* eslint no-console: ["error", { allow: ["log", "warn"] }] */

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";
import Filter from "./Filter.js";

const Reducer = {};

Reducer.root = (state, action) => {
  // LOGGER.debug(`root() type = ${action.type}`);

  if (typeof state === "undefined") {
    return AppState.create({ filters: Reducer.loadFromLocalStorage() });
  }

  let newFilteredTableRows;
  let newFilters;
  let newTableRows;

  switch (action.type) {
    case ActionType.APPLY_FILTERS:
      console.log(`Reducer APPLY_FILTERS`);
      newFilteredTableRows = Reducer.filterTableRows(
        state.tableColumns,
        state.tableRows,
        state.filters
      );
      Reducer.saveToLocalStorage(state.filters);
      return R.assoc("filteredTableRows", newFilteredTableRows, state);
    case ActionType.REMOVE_FILTERS:
      console.log("Reducer REMOVE_FILTERS");
      newFilteredTableRows = Reducer.sortTableRows(state.tableRows);
      return R.assoc("filteredTableRows", newFilteredTableRows, state);
    case ActionType.SET_DEFAULT_FILTERS:
      console.log("Reducer SET_DEFAULT_FILTERS");
      // newFilters = DefaultFilters.create(state.tableColumns);
      newFilters = [];
      return R.assoc("filters", newFilters, state);
    case ActionType.SET_FILTERS:
      console.log(`Reducer SET_FILTERS`);
      Reducer.saveToLocalStorage(action.filters);
      return R.assoc("filters", action.filters, state);
    case ActionType.SET_TABLE_COLUMNS:
      console.log(`Reducer SET_TABLE_COLUMNS`);
      return R.assoc("tableColumns", action.tableColumns, state);
    case ActionType.SET_TABLE_ROWS:
      console.log(`Reducer SET_TABLE_ROWS`);
      newTableRows = R.concat(state.tableRows, action.tableData);
      return R.pipe(
        R.assoc("tableRows", newTableRows),
        R.assoc("filteredTableRows", newTableRows)
      )(state);
    default:
      console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
      return state;
  }
};

Reducer.filterTableRows = (tableColumns, tableRows, filters) => {
  const answer = R.filter(data => Filter.passesAll(tableColumns, filters, data), tableRows);

  return Reducer.sortTableRows(answer);
};

Reducer.loadFromLocalStorage = () =>
  localStorage.filters ? JSON.parse(localStorage.filters) : undefined;

Reducer.saveToLocalStorage = filters => {
  localStorage.filters = JSON.stringify(filters);
};

Reducer.sortTableRows = tableRows => R.sort(R.ascend(R.prop("boardGameRank")), tableRows);

Object.freeze(Reducer);

export default Reducer;
