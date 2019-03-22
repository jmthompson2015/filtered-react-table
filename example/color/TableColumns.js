import ColorSwatch from "./ColorSwatch.js";

const firstCharUpper = string => string.charAt(0).toUpperCase() + string.substring(1);

const TableColumns = [
  {
    key: "swatch",
    label: "Swatch",
    type: "none",
    cellFunction: row => {
      const color = { r: row.red, g: row.green, b: row.blue };
      return React.createElement(ColorSwatch, { color, width: 50 });
    },
    valueFunction: row => row.name
  },
  {
    key: "name",
    label: "Name",
    className: "tl"
  },
  {
    key: "red",
    label: "Red",
    type: "number",
    className: "tr"
  },
  {
    key: "green",
    label: "Green",
    type: "number",
    className: "tr"
  },
  {
    key: "blue",
    label: "Blue",
    type: "number",
    className: "tr"
  },
  {
    key: "category",
    label: "Category",
    className: "tl",
    convertFunction: row => (row.category ? firstCharUpper(row.category) : undefined)
  },
  {
    key: "liked",
    label: "Liked",
    type: "boolean"
  }
];

export default TableColumns;
