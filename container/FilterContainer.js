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
    dispatch(ActionCreator.applyFilters());
  },
  onChange: filters => {
    dispatch(ActionCreator.setFilters(filters));
  },
  removeOnClick: () => {
    dispatch(ActionCreator.removeFilters());
  }
});

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterUI);
