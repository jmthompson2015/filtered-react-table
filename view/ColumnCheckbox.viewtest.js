/* eslint no-console: ["error", { allow: ["log"] }] */

import ColumnCheckbox from "./ColumnCheckbox.js";

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

const myOnChange = (columnKey, isChecked) => {
  console.log(`myOnChange() columnKey = ${columnKey} isChecked ? ${isChecked}`);
};

const element0 = React.createElement(ColumnCheckbox, {
  column: TableColumns[0], // Name
  isChecked: true,
  onChange: myOnChange
});
ReactDOM.render(element0, document.getElementById("panel0"));

const element1 = React.createElement(ColumnCheckbox, {
  column: TableColumns[1], // Red
  isChecked: false,
  onChange: myOnChange
});
ReactDOM.render(element1, document.getElementById("panel1"));

const element2 = React.createElement(ColumnCheckbox, {
  column: TableColumns[2], // Green
  isChecked: true,
  onChange: myOnChange
});
ReactDOM.render(element2, document.getElementById("panel2"));

const element3 = React.createElement(ColumnCheckbox, {
  column: TableColumns[3], // Blue
  isChecked: false,
  onChange: myOnChange
});
ReactDOM.render(element3, document.getElementById("panel3"));
