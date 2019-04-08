import FilterType from "../state/FilterType.js";
import TCU from "../state/TableColumnUtilities.js";

import ReactUtils from "./ReactUtilities.js";

const determineValue = (column, row) => {
  if (column.type === FilterType.BOOLEAN) {
    if (row[column.key] === true) return "true";
    if (row[column.key] === false) return "false";
    return undefined;
  }
  return TCU.determineValue(column, row);
};

const filterTableColumns = tableColumns => {
  const reduceFunction1 = (accum1, column) => {
    if (!column.isHidden) {
      const reduceFunction0 = (accum0, key) => {
        if (["cellFunction", "convertFunction", "valueFunction"].includes(key)) {
          return accum0;
        }
        const value = column[key];

        return R.assoc(key, value, accum0);
      };
      const newColumn = R.reduce(reduceFunction0, {}, Object.keys(column));

      return R.append(newColumn, accum1);
    }
    return accum1;
  };

  return R.reduce(reduceFunction1, [], tableColumns);
};

class DataTable extends React.PureComponent {
  constructor(props) {
    super(props);

    // Factories.
    this.Table = React.createFactory(Reactable.Table);
    this.Tr = React.createFactory(Reactable.Tr);
    this.Td = React.createFactory(Reactable.Td);
  }

  createRow(data, key) {
    const { tableColumns } = this.props;
    const mapFunction = column => {
      const value = determineValue(column, data);
      const cell = TCU.determineCell(column, data);
      return this.Td(
        { key: column.key + data.id, className: column.className, column: column.key, value },
        cell === undefined ? "" : cell
      );
    };
    const cells = R.map(mapFunction, tableColumns);

    return this.Tr({ key }, cells);
  }

  createTable(rowData) {
    const { tableColumns } = this.props;

    const myTableColumns = filterTableColumns(tableColumns);
    const mapFunction = data => this.createRow(data, data.id || data.name);
    const rows = R.map(mapFunction, rowData);

    return this.Table({ className: "frt-table", columns: myTableColumns, sortable: true }, rows);
  }

  render() {
    const { rowData } = this.props;

    const rowCount = `Row Count: ${rowData.length}`;
    const table = this.createTable(rowData);

    const rows = [
      ReactUtils.createRow(ReactUtils.createCell(rowCount, "top", "frt-rowCount"), "topRow"),
      ReactUtils.createRow(ReactUtils.createCell(table), "tableRow"),
      ReactUtils.createRow(ReactUtils.createCell(rowCount, "bottom", "frt-rowCount"), "bottomRow")
    ];

    return ReactUtils.createTable(rows);
  }
}

DataTable.propTypes = {
  rowData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default DataTable;
