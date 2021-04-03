const ActionType = {};

ActionType.APPLY_FILTERS = "applyFilters";
ActionType.APPLY_SHOW_COLUMNS = "applyShowColumns";
ActionType.REMOVE_FILTERS = "removeFilters";
ActionType.SET_APP_NAME = "setAppName";
ActionType.SET_FILTER_GROUP = "setFilterGroup";
ActionType.SET_TABLE_COLUMNS = "setTableColumns";
ActionType.SET_TABLE_ROWS = "setTableRows";
ActionType.SET_VERBOSE = "setVerbose";

Object.freeze(ActionType);

export default ActionType;
