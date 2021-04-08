import ActionCreator from "../state/ActionCreator.js";

const { CheckboxPanel } = ReactComponent;

const getColumnMap = (tableColumns) => {
  const reduceFunction = (accum, column) => R.assoc(column.key, column, accum);

  return R.reduce(reduceFunction, {}, tableColumns);
};

const getSelectedItems = (columnToChecked) => {
  const reduceFunction = (accum, columnKey) =>
    columnToChecked[columnKey] === true ? R.append(columnKey, accum) : accum;

  return R.reduce(reduceFunction, [], Object.keys(columnToChecked));
};

const mapStateToProps = (state) => {
  const { columnToChecked, tableColumns } = state;
  const columnMap = getColumnMap(tableColumns);
  const items = R.map(R.prop("key"), tableColumns);
  const selectedItems = getSelectedItems(columnToChecked);
  const labelFunction = (item) => columnMap[item].label;

  return {
    items,
    labelFunction,
    selectedItems,
  };
};

const mapDispatchToProps = (dispatch) => ({
  applyOnClick: (selectedItems) => {
    const reduceFunction = (accum, columnKey) =>
      R.assoc(columnKey, true, accum);
    const columnToChecked = R.reduce(reduceFunction, {}, selectedItems);
    dispatch(ActionCreator.applyShowColumns(columnToChecked));
  },
});

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckboxPanel);
