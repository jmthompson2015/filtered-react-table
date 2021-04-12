import TCU from "../state/TableColumnUtilities.js";

const { ClauseType } = FilterJS;
const { ReactUtilities: RU } = ReactComponent;

const determineValue = (column, row) => {
  if (column.type === ClauseType.BOOLEAN) {
    if (row[column.key] === true) return "true";
    if (row[column.key] === false) return "false";
    return undefined;
  }
  return TCU.determineValue(column, row);
};

const filterTableColumns = (columnToChecked, tableColumns) => {
  const reduceFunction1 = (accum1, column) => {
    if (columnToChecked[column.key]) {
      const reduceFunction0 = (accum0, key) => {
        if (
          [
            "cellFunction",
            "convertFunction",
            "isShown",
            "valueFunction",
          ].includes(key)
        ) {
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
  createRow(data, key) {
    const { rowClass, tableColumns } = this.props;
    const mapFunction = (column) => {
      const value = determineValue(column, data);
      const cell = TCU.determineCell(column, data);
      return React.createElement(
        Reactable.Td,
        {
          key: column.key + data.id,
          className: column.className,
          column: column.key,
          value,
        },
        cell === undefined ? "" : cell
      );
    };
    const cells = R.map(mapFunction, tableColumns);

    return React.createElement(
      Reactable.Tr,
      { key, className: rowClass },
      cells
    );
  }

  createTable(rowData) {
    const { columnToChecked, dataTableClass, tableColumns } = this.props;

    const myTableColumns = filterTableColumns(columnToChecked, tableColumns);
    const mapFunction = (data) => this.createRow(data, data.id || data.name);
    const rows = R.map(mapFunction, rowData);

    return React.createElement(
      Reactable.Table,
      {
        className: `frt-table ${dataTableClass}`,
        columns: myTableColumns,
        sortable: true,
      },
      rows
    );
  }

  render() {
    const { className, rowCountClass, rowData } = this.props;

    const rowCount = `Row Count: ${rowData.length}`;
    const table = this.createTable(rowData);

    const rows = [
      RU.createRow(RU.createCell(rowCount, "top", rowCountClass), "topRow"),
      RU.createRow(RU.createCell(table), "tableRow"),
      RU.createRow(
        RU.createCell(rowCount, "bottom", rowCountClass),
        "bottomRow"
      ),
    ];

    return RU.createTable(rows, "dataTablePanel", className);
  }
}

DataTable.propTypes = {
  columnToChecked: PropTypes.shape().isRequired,
  rowData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  className: PropTypes.string,
  dataTableClass: PropTypes.string,
  rowClass: PropTypes.string,
  rowCountClass: PropTypes.string,
};

DataTable.defaultProps = {
  className: undefined,
  dataTableClass: "bg-white collapse f6 tc",
  rowClass: "striped--white-smoke",
  rowCountClass: "f6 tl",
};

export default DataTable;
