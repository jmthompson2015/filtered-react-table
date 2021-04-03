import ColorSwatch from "./ColorSwatch.js";

const firstCharUpper = (string) =>
  string.charAt(0).toUpperCase() + string.substring(1);

const TableColumns = [
  {
    key: "swatch",
    label: "Swatch",
    type: "none",
    cellFunction: (row) => {
      const color = { r: row.red, g: row.green, b: row.blue };
      return React.createElement(ColorSwatch, { color, width: 50 });
    },
    valueFunction: (row) => row.name,
  },
  {
    key: "id",
    label: "ID",
    type: "number",
    isShown: false,
  },
  {
    key: "name",
    label: "Name",
    className: "frt-tl",
  },
  {
    key: "red",
    label: "Red",
    type: "number",
    min: 0,
    max: 255,
    step: 5,
    className: "frt-tr",
  },
  {
    key: "green",
    label: "Green",
    type: "number",
    min: 0,
    max: 255,
    step: 5,
    className: "frt-tr",
  },
  {
    key: "blue",
    label: "Blue",
    type: "number",
    min: 0,
    max: 255,
    step: 5,
    className: "frt-tr",
  },
  {
    key: "category",
    label: "Category",
    className: "frt-tl",
    convertFunction: (row) =>
      row.category ? firstCharUpper(row.category) : undefined,
  },
  {
    key: "components",
    label: "Components",
    valueFunction: (row) => row.components.join(" "),
  },
  {
    key: "liked",
    label: "Liked",
    type: "boolean",
  },
];

export default TableColumns;
