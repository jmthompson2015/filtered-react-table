/* eslint no-console: ["error", { allow: ["log"] }] */

import ShowColumnsUI from "./ShowColumnsUI.js";

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

const myColumnToChecked = {
  name: true,
  red: false,
  green: true,
  blue: false,
  liked: true
};

const applyOnClick = columnToChecked => {
  console.log(`applyOnClick() columnToChecked = ${JSON.stringify(columnToChecked)}`);
};

const element = React.createElement(ShowColumnsUI, {
  columnToChecked: myColumnToChecked,
  tableColumns: TableColumns,
  applyOnClick
});
ReactDOM.render(element, document.getElementById("panel"));
