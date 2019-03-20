/* eslint no-console: ["error", { allow: ["log"] }] */

import EU from "../state/EnumUtilities.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";

import Select from "./Select.js";

const TableColumns1 = [
  { key: "name", label: "Name" },
  { key: "red", label: "Red" },
  { key: "green", label: "Green" },
  { key: "blue", label: "Blue" }
];

const myOnChange1 = columnKey => {
  console.log(`myOnChange() columnKey = ${JSON.stringify(columnKey)}`);
};

const element1 = React.createElement(Select, {
  id: "element1",
  onChange: myOnChange1,
  values: TableColumns1,
  initialValue: "red"
});
ReactDOM.render(element1, document.getElementById("panel1"));

const myOnChange2 = operatorKey => {
  console.log(`myOnChange() operatorKey = ${JSON.stringify(operatorKey)}`);
};

const element2 = React.createElement(Select, {
  id: "element2",
  onChange: myOnChange2,
  values: EU.values(NFO),
  valueKey: NFO.IS_NOT
});
ReactDOM.render(element2, document.getElementById("panel2"));

const myOnChange3 = operatorKey => {
  console.log(`myOnChange() operatorKey = ${JSON.stringify(operatorKey)}`);
};

const element3 = React.createElement(Select, {
  id: "element3",
  onChange: myOnChange3,
  values: EU.values(SFO),
  valueKey: SFO.DOES_NOT_CONTAIN
});
ReactDOM.render(element3, document.getElementById("panel3"));
