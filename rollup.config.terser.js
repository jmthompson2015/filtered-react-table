const { terser } = require("rollup-plugin-terser");

export default {
  input: "FilteredReactTable.js",
  output: {
    file: "./dist/filtered-react-table.min.js",
    format: "umd",
    name: "FilteredReactTable"
  },
  plugins: [terser()]
};
