/* eslint no-console: ["error", { allow: ["log", "warn"] }] */

import ActionType from "./ActionType.js";
import AppState from "./AppState.js";
import Preferences from "./Preferences.js";

const { Filter, FilterGroup } = FilterJS;

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
        state.tableRows,
        state.filterGroup
      );
      return R.assoc("filteredTableRows", newFilteredTableRows, state);
    case ActionType.APPLY_SHOW_COLUMNS:
      if (state.isVerbose) {
        console.log(
          `Reducer APPLY_SHOW_COLUMNS columnToChecked = ${JSON.stringify(
            action.columnToChecked
          )}`
        );
      }
      Preferences.setColumnToChecked(
        state.appName,
        Immutable(action.columnToChecked)
      );
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
    case ActionType.SET_DEFAULT_SORT:
      if (state.isVerbose) {
        console.log(
          `Reducer SET_DEFAULT_SORT defaultSort = ${JSON.stringify(
            action.defaultSort
          )}`
        );
      }
      return R.assoc("defaultSort", action.defaultSort, state);
    case ActionType.SET_FILTER_GROUP:
      if (state.isVerbose) {
        console.log(
          `Reducer SET_FILTER_GROUP filterGroup = ${JSON.stringify(
            action.filterGroup
          )}`
        );
      }
      Preferences.setFilterGroup(state.appName, Immutable(action.filterGroup));
      return R.assoc("filterGroup", action.filterGroup, state);
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

Reducer.filterTableRows = (tableRows, filterGroup) => {
  const filter = FilterGroup.selectedFilter(filterGroup);
  const filterFunction = (data) => Filter.passes(filter, data);

  return Immutable(R.filter(filterFunction, tableRows));
};

Object.freeze(Reducer);

export default Reducer;
