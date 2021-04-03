import ActionCreator from "../state/ActionCreator.js";

const { FilterGroup, FilterGroupUI } = FilterJS;

const mapStateToProps = (state) => {
  const { filterGroup, tableColumns } = state;
  let myFilterGroup;

  if (filterGroup && !Array.isArray(filterGroup)) {
    myFilterGroup = filterGroup;
  } else {
    myFilterGroup = FilterGroup.default(tableColumns);
  }

  const filterFunction = (c) => c.type !== "none";
  const myTableColumns = R.filter(filterFunction, tableColumns);

  return {
    initialFilterGroup: myFilterGroup,
    tableColumns: myTableColumns,
  };
};

const mapDispatchToProps = (dispatch) => ({
  applyOnClick: () => {
    dispatch(ActionCreator.applyFilters());
  },
  onChange: (filterGroup) => {
    dispatch(ActionCreator.setFilterGroup(filterGroup));
  },
  removeOnClick: () => {
    dispatch(ActionCreator.removeFilters());
  },
});

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterGroupUI);
