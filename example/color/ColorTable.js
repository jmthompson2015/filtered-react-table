/* eslint no-console: ["error", { allow: ["log"] }] */

import FilteredReactTable from "../../FilteredReactTable.js";
import TableColumns from "./TableColumns.js";
import TableRows from "./TableRows.js";

const appName = "ColorTable";
const onColumnChange = tableColumns => {
  console.log(`onColumnChange() tableColumns = ${JSON.stringify(tableColumns)}`);
};
const onFilterChange = filteredTableRows => {
  console.log(`onFilterChange() filteredTableRows = ${JSON.stringify(filteredTableRows)}`);
};
const isVerbose = true;

const frt = new FilteredReactTable(
  TableColumns,
  TableRows,
  appName,
  onColumnChange,
  onFilterChange,
  isVerbose
);

const filter = frt.filterElement();
ReactDOM.render(filter, document.getElementById("filter"));

const table = frt.tableElement();
ReactDOM.render(table, document.getElementById("table"));
