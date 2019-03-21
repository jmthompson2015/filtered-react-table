import FilteredReactTable from "../../FilteredReactTable.js";
import TableColumns from "./TableColumns.js";
import TableRows from "./TableRows.js";

const frt = new FilteredReactTable(TableColumns, TableRows);

const filter = frt.filterElement();
ReactDOM.render(filter, document.getElementById("filter"));

const table = frt.tableElement();
ReactDOM.render(table, document.getElementById("table"));
