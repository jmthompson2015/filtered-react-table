import ColorSwatch from "./ColorSwatch.js";

const TableColumns = [
  {
    key: "swatch",
    label: "Swatch",
    type: "none",
    cellFunction: row => {
      const color = { r: row.red, g: row.green, b: row.blue };
      return React.createElement(ColorSwatch, { color, width: 50 });
    }
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
    className: "tl"
  }
];

export default TableColumns;
