import DataTable from "../view/DataTable.js";

const mapStateToProps = state => ({
  rowData: state.filteredTableRows,
  tableColumns: state.tableColumns
});

export default ReactRedux.connect(mapStateToProps)(DataTable);
