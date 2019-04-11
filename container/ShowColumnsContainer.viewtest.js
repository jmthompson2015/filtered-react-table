import ActionCreator from "../state/ActionCreator.js";
import Reducer from "../state/Reducer.js";

import ShowColumnsContainer from "./ShowColumnsContainer.js";

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

const columnToChecked = {
  name: true,
  red: false,
  green: true,
  blue: false,
  liked: true
};

const store = Redux.createStore(Reducer.root);
store.dispatch(ActionCreator.setVerbose(true));
store.dispatch(ActionCreator.setTableColumns(TableColumns));
store.dispatch(ActionCreator.applyShowColumns(columnToChecked));

const container = React.createElement(ShowColumnsContainer);
const element = React.createElement(ReactRedux.Provider, { store }, container);

ReactDOM.render(element, document.getElementById("panel"));
