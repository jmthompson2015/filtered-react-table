import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";

import FilterContainer from "./FilterContainer.js";

const { FilterGroup } = FilterJS;

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

const filterGroup = FilterGroup.default(TableColumns);

const store = Redux.createStore(Reducer.root);
store.dispatch(ActionCreator.setTableColumns(TableColumns));
store.dispatch(ActionCreator.setFilterGroup(filterGroup));

const container = React.createElement(FilterContainer);
const element = React.createElement(ReactRedux.Provider, { store }, container);

ReactDOM.render(element, document.getElementById("panel"));
