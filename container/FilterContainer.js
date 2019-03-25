import ActionCreator from "../state/ActionCreator.js";

import FilterUI from "../view/FilterUI.js";

const mapStateToProps = state => {
  const { filters, tableColumns } = state;
  const myTableColumns = R.filter(c => c.type !== "none", tableColumns);

  return {
    filters,
    tableColumns: myTableColumns
  };
};

const mapDispatchToProps = (dispatch /* , ownProps */) => ({
  applyOnClick: () => {
    console.log("applyOnClick()");
    dispatch(ActionCreator.applyFilters());
  },
  clearCacheOnClick: () => {
    console.log("clearCacheOnClick()");
    localStorage.removeItem("filters");
  },
  onChange: filters => {
    console.log("FilterContainer onChange()");
    dispatch(ActionCreator.setFilters(filters));
  },
  removeOnClick: () => {
    console.log("removeOnClick()");
    dispatch(ActionCreator.removeFilters());
  },
  restoreDefaultsOnClick: () => {
    console.log("restoreDefaultsOnClick()");
    dispatch(ActionCreator.setDefaultFilters());
  }
});

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterUI);
