import DataTable from "./DataTable.js";

const rowData = [
  { name: "Red", red: 255, green: 0, blue: 0, category: "Primary" },
  { name: "Green", red: 0, green: 255, blue: 0, category: "Primary" },
  { name: "Blue", red: 0, green: 0, blue: 255, category: "Primary" }
];

const TableColumns = [
  { key: "name", label: "Name" },
  { key: "red", label: "Red", type: "number" },
  { key: "green", label: "Green", type: "number" },
  { key: "blue", label: "Blue", type: "number" }
];

const columnToChecked = {
  name: true,
  red: true,
  green: true,
  blue: true
};

const element = React.createElement(DataTable, {
  columnToChecked,
  rowData,
  tableColumns: TableColumns
});
ReactDOM.render(element, document.getElementById("panel"));
