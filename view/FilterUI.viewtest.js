/* eslint no-console: ["error", { allow: ["log"] }] */

import BFO from "../state/BooleanFilterOperator.js";
import FilterClause from "../state/FilterClause.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";

import FilterUI from "./FilterUI.js";

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

const applyOnClick = (event) => {
  const { filters: filtersString } = event.currentTarget.dataset;
  const filters = JSON.parse(filtersString);
  console.log(`applyOnClick() filters = ${JSON.stringify(filters)}`);
};
const clearCacheOnClick = () => console.log("clearCacheOnClick()");
const removeOnClick = () => console.log("removeOnClick()");
const restoreDefaultsOnClick = () => console.log("restoreDefaultsOnClick()");

const filter1 = FilterClause.create({
  columnKey: "name",
  operatorKey: SFO.CONTAINS,
  rhs: "ed",
});
const filter2 = FilterClause.create({
  columnKey: "red",
  operatorKey: NFO.IS_GREATER_THAN,
  rhs: 100,
});
const filter3 = FilterClause.create({
  columnKey: "green",
  operatorKey: NFO.IS_IN_THE_RANGE,
  rhs: 50,
  rhs2: 255,
});
const filter4 = FilterClause.create({
  columnKey: "liked",
  operatorKey: BFO.IS_FALSE,
});
const filters = [filter1, filter2, filter3, filter4];

const onChange = (newFilters) => {
  console.log(`onChange() newFilters = ${JSON.stringify(newFilters)}`);
};

const element = React.createElement(FilterUI, {
  filters,
  onChange,
  tableColumns: TableColumns,

  applyOnClick,
  clearCacheOnClick,
  removeOnClick,
  restoreDefaultsOnClick,
});
ReactDOM.render(element, document.getElementById("panel"));
