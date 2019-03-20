/* eslint no-console: ["error", { allow: ["log"] }] */

import Filter from "../state/Filter.js";
import NFO from "../state/NumberFilterOperator.js";

import FilterRow from "./FilterRow.js";

const TableColumns = [
  {
    key: "name",
    label: "Name"
  },
  {
    key: "red",
    label: "Red",
    type: "number"
  },
  {
    key: "green",
    label: "Green",
    type: "number"
  },
  {
    key: "blue",
    label: "Blue",
    type: "number"
  }
];

const filter = Filter.create({ columnKey: "red", operatorKey: NFO.IS_GREATER_THAN, rhs: 50 });

const onChange = (newFilter, index) => {
  console.log(`onChange() newFilter = ${JSON.stringify(newFilter)} index = ${index}`);
};

const element = React.createElement(FilterRow, { filter, tableColumns: TableColumns, onChange });
ReactDOM.render(element, document.getElementById("panel"));
