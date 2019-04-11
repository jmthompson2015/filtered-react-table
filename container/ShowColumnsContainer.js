import ActionCreator from "../state/ActionCreator.js";

import ShowColumnsUI from "../view/ShowColumnsUI.js";

const mapStateToProps = state => {
  const { columnToChecked, tableColumns } = state;

  return {
    columnToChecked,
    tableColumns
  };
};

const mapDispatchToProps = dispatch => ({
  applyOnClick: columnToChecked => {
    dispatch(ActionCreator.applyShowColumns(columnToChecked));
  }
});

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowColumnsUI);
