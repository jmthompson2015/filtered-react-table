/* eslint no-console: ["error", { allow: ["log"] }] */

import Filter from "../state/Filter.js";
import SFO from "../state/StringFilterOperator.js";

import FilterUI from "./FilterUI.js";

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
  },
  {
    key: "liked",
    label: "Liked",
    type: "boolean"
  }
];

const applyOnClick = event => {
  const { filters: filtersString } = event.currentTarget.dataset;
  const filters = JSON.parse(filtersString);
  console.log(`applyOnClick() filters = ${JSON.stringify(filters)}`);
};
const clearCacheOnClick = () => console.log("clearCacheOnClick()");
const removeOnClick = () => console.log("removeOnClick()");
const restoreDefaultsOnClick = () => console.log("restoreDefaultsOnClick()");

const filters = [Filter.create({ columnKey: "red", operatorKey: SFO.IS, rhs: 255 })];

const onChange = newFilters => {
  console.log(`onChange() newFilters = ${JSON.stringify(newFilters)}`);
};

const element = React.createElement(FilterUI, {
  filters,
  onChange,
  tableColumns: TableColumns,

  applyOnClick,
  clearCacheOnClick,
  removeOnClick,
  restoreDefaultsOnClick
});
ReactDOM.render(element, document.getElementById("panel"));
