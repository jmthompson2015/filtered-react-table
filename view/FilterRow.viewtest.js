/* eslint no-console: ["error", { allow: ["log"] }] */

import BFO from "../state/BooleanFilterOperator.js";
import FilterClause from "../state/FilterClause.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";

import FilterRow from "./FilterRow.js";

const TableColumns = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "red",
    label: "Red",
    type: "number",
  },
  {
    key: "green",
    label: "Green",
    type: "number",
  },
  {
    key: "blue",
    label: "Blue",
    type: "number",
  },
  {
    key: "liked",
    label: "Liked",
    type: "boolean",
  },
];

const onChange = (newFilterClause, index) => {
  console.log(
    `onChange() newFilterClause = ${JSON.stringify(
      newFilterClause
    )} index = ${index}`
  );
};

const filter1 = FilterClause.create({
  columnKey: "liked",
  operatorKey: BFO.IS_TRUE,
});
const element1 = React.createElement(FilterRow, {
  filter: filter1,
  index: 1,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element1, document.getElementById("panel1"));

const filter2 = FilterClause.create({
  columnKey: "red",
  operatorKey: NFO.IS_GREATER_THAN,
  rhs: 50,
});
const element2 = React.createElement(FilterRow, {
  filter: filter2,
  index: 2,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element2, document.getElementById("panel2"));

const filter3 = FilterClause.create({
  columnKey: "name",
  operatorKey: SFO.CONTAINS,
  rhs: "e",
});
const element3 = React.createElement(FilterRow, {
  filter: filter3,
  index: 3,
  tableColumns: TableColumns,
  onChange,
});
ReactDOM.render(element3, document.getElementById("panel3"));
