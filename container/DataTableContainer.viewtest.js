import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";

import DataTableContainer from "./DataTableContainer.js";

const rowData = [
  { name: "Red", red: 255, green: 0, blue: 0, category: "Primary" },
  { name: "Green", red: 0, green: 255, blue: 0, category: "Primary" },
  { name: "Blue", red: 0, green: 0, blue: 255, category: "Primary" },
];

const TableColumns = [
  { key: "name", label: "Name" },
  { key: "red", label: "Red", type: "number" },
  { key: "green", label: "Green", type: "number" },
  { key: "blue", label: "Blue", type: "number" },
];

const defaultSort = {
  column: "name",
  direction: "asc",
};

const store = Redux.createStore(Reducer.root);
store.dispatch(ActionCreator.setTableColumns(TableColumns));
store.dispatch(ActionCreator.setTableRows(rowData));
store.dispatch(ActionCreator.setDefaultSort(defaultSort));

const container = React.createElement(DataTableContainer);
const element = React.createElement(ReactRedux.Provider, { store }, container);

ReactDOM.render(element, document.getElementById("panel"));
