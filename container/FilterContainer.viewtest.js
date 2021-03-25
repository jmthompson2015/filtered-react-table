/* eslint no-console: ["error", { allow: ["log"] }] */

import ActionCreator from "../state/ActionCreator.js";
import FilterClause from "../state/FilterClause.js";
import Reducer from "../state/Reducer.js";
import SFO from "../state/StringFilterOperator.js";

import FilterContainer from "./FilterContainer.js";

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

const filters = [
  FilterClause.create({ columnKey: "red", operatorKey: SFO.IS, rhs: 255 }),
];

const store = Redux.createStore(Reducer.root);
store.dispatch(ActionCreator.setTableColumns(TableColumns));
store.dispatch(ActionCreator.setFilters(filters));

const container = React.createElement(FilterContainer);
const element = React.createElement(ReactRedux.Provider, { store }, container);

ReactDOM.render(element, document.getElementById("panel"));
