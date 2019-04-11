import DataTable from "../view/DataTable.js";

const mapStateToProps = state => ({
  columnToChecked: state.columnToChecked,
  rowData: state.filteredTableRows,
  tableColumns: state.tableColumns
});

export default ReactRedux.connect(mapStateToProps)(DataTable);
