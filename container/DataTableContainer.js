import DataTable from "../view/DataTable.js";

const mapStateToProps = (state, ownProps = {}) =>
  R.mergeRight(
    {
      columnToChecked: state.columnToChecked,
      rowData: state.filteredTableRows,
      tableColumns: state.tableColumns,
    },
    ownProps
  );

export default ReactRedux.connect(mapStateToProps)(DataTable);
