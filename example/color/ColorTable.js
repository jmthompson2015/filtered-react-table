/* eslint no-console: ["error", { allow: ["log"] }] */

import FilteredReactTable from "../../FilteredReactTable.js";
import TableColumns from "./TableColumns.js";
import TableRows from "./TableRows.js";

const appName = "ColorTable";
const onFilterChange = filteredTableRows => {
  console.log(`onFilterChange() filteredTableRows = ${JSON.stringify(filteredTableRows)}`);
};
const onShowColumnChange = columnToChecked => {
  console.log(`onShowColumnChange() columnToChecked = ${JSON.stringify(columnToChecked)}`);
};
const isVerbose = true;

const frt = new FilteredReactTable(
  TableColumns,
  TableRows,
  appName,
  onFilterChange,
  onShowColumnChange,
  isVerbose
);

const filter = frt.filterElement();
ReactDOM.render(filter, document.getElementById("filter"));

const showColumns = frt.showColumnsElement();
ReactDOM.render(showColumns, document.getElementById("showColumns"));

const table = frt.tableElement();
ReactDOM.render(table, document.getElementById("table"));
