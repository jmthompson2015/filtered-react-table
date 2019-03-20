/* eslint no-console: ["error", { allow: ["log"] }] */

import ActionCreator from "../../state/ActionCreator.js";
import Reducer from "../../state/Reducer.js";

import DataTableContainer from "../../container/DataTableContainer.js";
import FilterContainer from "../../container/FilterContainer.js";

import TableRows from "./TableRows.js";
import TableColumns from "./TableColumns.js";

const store = Redux.createStore(Reducer.root);
store.dispatch(ActionCreator.setTableColumns(TableColumns));
store.dispatch(ActionCreator.setTableRows(TableRows));
store.dispatch(ActionCreator.setDefaultFilters());

const container0 = React.createElement(FilterContainer);
const element0 = React.createElement(ReactRedux.Provider, { store }, container0);
ReactDOM.render(element0, document.getElementById("filter"));

const container1 = React.createElement(DataTableContainer);
const element1 = React.createElement(ReactRedux.Provider, { store }, container1);
ReactDOM.render(element1, document.getElementById("table"));
