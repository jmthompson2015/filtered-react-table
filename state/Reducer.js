/* eslint no-console: ["error", { allow: ["log", "warn"] }] */

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";
import Filter from "./Filter.js";
import Preferences from "./Preferences.js";

const Reducer = {};

Reducer.root = (state, action) => {
  // LOGGER.debug(`root() type = ${action.type}`);

  if (typeof state === "undefined") {
    return AppState.create();
  }

  let newFilteredTableRows;

  switch (action.type) {
    case ActionType.APPLY_FILTERS:
      if (state.isVerbose) {
        console.log(`Reducer APPLY_FILTERS`);
      }
      newFilteredTableRows = Reducer.filterTableRows(
        state.tableColumns,
        state.tableRows,
        state.filters
      );
      return R.assoc("filteredTableRows", newFilteredTableRows, state);
    case ActionType.APPLY_SHOW_COLUMNS:
      if (state.isVerbose) {
        console.log(
          `Reducer APPLY_SHOW_COLUMNS columnToChecked = ${JSON.stringify(action.columnToChecked)}`
        );
      }
      return R.assoc("columnToChecked", action.columnToChecked, state);
    case ActionType.REMOVE_FILTERS:
      if (state.isVerbose) {
        console.log("Reducer REMOVE_FILTERS");
      }
      return R.assoc("filteredTableRows", state.tableRows, state);
    case ActionType.SET_APP_NAME:
      if (state.isVerbose) {
        console.log(`Reducer SET_APP_NAME appName = ${action.appName}`);
      }
      return R.assoc("appName", action.appName, state);
    case ActionType.SET_FILTERS:
      if (state.isVerbose) {
        console.log(`Reducer SET_FILTERS`);
      }
      Preferences.setFilters(state.appName, Immutable(action.filters));
      return R.assoc("filters", action.filters, state);
    case ActionType.SET_TABLE_COLUMNS:
      if (state.isVerbose) {
        console.log(`Reducer SET_TABLE_COLUMNS`);
      }
      return R.assoc("tableColumns", Immutable(action.tableColumns), state);
    case ActionType.SET_TABLE_ROWS:
      if (state.isVerbose) {
        console.log(`Reducer SET_TABLE_ROWS`);
      }
      return R.pipe(
        R.assoc("tableRows", Immutable(action.tableRows)),
        R.assoc("filteredTableRows", Immutable(action.tableRows))
      )(state);
    case ActionType.SET_VERBOSE:
      console.log(`Reducer SET_VERBOSE isVerbose ? ${action.isVerbose}`);
      return R.assoc("isVerbose", action.isVerbose, state);
    default:
      console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
      return state;
  }
};

Reducer.filterTableRows = (tableColumns, tableRows, filters) =>
  Immutable(R.filter(data => Filter.passesAll(tableColumns, filters, data), tableRows));

Object.freeze(Reducer);

export default Reducer;
