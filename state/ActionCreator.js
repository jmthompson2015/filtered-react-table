import ActionType from "./ActionType.js";

const ActionCreator = {};

// See https://redux.js.org/recipes/reducing-boilerplate
const makeActionCreator = (type, ...argNames) => (...args) => {
  const action = { type };
  argNames.forEach((arg, index) => {
    action[argNames[index]] = args[index];
  });
  return action;
};

ActionCreator.applyFilters = makeActionCreator(ActionType.APPLY_FILTERS);

ActionCreator.removeFilters = makeActionCreator(ActionType.REMOVE_FILTERS);

ActionCreator.setFilters = makeActionCreator(ActionType.SET_FILTERS, "filters");

ActionCreator.setTableColumns = makeActionCreator(ActionType.SET_TABLE_COLUMNS, "tableColumns");

ActionCreator.setTableRows = makeActionCreator(ActionType.SET_TABLE_ROWS, "tableRows");

Object.freeze(ActionCreator);

export default ActionCreator;
