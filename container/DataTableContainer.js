import DataTable from "../view/DataTable.js";

const mapStateToProps = (state, ownProps = {}) =>
  R.mergeRight(
    {
      columnToChecked: state.columnToChecked,
      defaultSort: state.defaultSort,
      rowData: state.filteredTableRows,
      tableColumns: state.tableColumns,
    },
    ownProps
  );

export default ReactRedux.connect(mapStateToProps)(DataTable);
