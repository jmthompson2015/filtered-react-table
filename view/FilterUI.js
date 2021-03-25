import BFO from "../state/BooleanFilterOperator.js";
import FilterClause from "../state/FilterClause.js";
import FilterClauseType from "../state/FilterClauseType.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";

import FilterRow from "./FilterRow.js";
import ReactUtils from "./ReactUtilities.js";

class FilterClauseUI extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
    this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
  }

  createButtonTable() {
    const { applyOnClick, removeOnClick } = this.props;

    const unfilterButton = ReactDOMFactories.button(
      { onClick: removeOnClick },
      "Remove"
    );
    const filterButton = ReactDOMFactories.button(
      { onClick: applyOnClick },
      "Apply"
    );

    const cells = [
      ReactUtils.createCell(unfilterButton, "unfilterButton", "button"),
      ReactUtils.createCell(filterButton, "filterButton", "button"),
    ];
    const row = ReactUtils.createRow(cells, "button-row");

    return ReactUtils.createTable(row, "buttonTable", "buttons");
  }

  createTable() {
    const rows = [];

    const { filters, tableColumns } = this.props;
    const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;
    const filters2 = R.concat([], filters);

    if (filters2.length === 0) {
      const firstColumn = tableColumns[0];
      let newFilterClause;

      switch (firstColumn.type) {
        case FilterClauseType.BOOLEAN:
          newFilterClause = FilterClause.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(BFO.properties)[0],
          });
          break;
        case FilterClauseType.NUMBER:
          newFilterClause = FilterClause.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(NFO.properties)[0],
            rhs: 0,
          });
          break;
        case FilterClauseType.STRING:
        case undefined:
          newFilterClause = FilterClause.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(SFO.properties)[0],
            rhs: "",
          });
          break;
        default:
          throw new Error(`Unknown firstColumn.type: ${firstColumn.type}`);
      }

      filters2.push(newFilterClause);
    }

    for (let i = 0; i < filters2.length; i += 1) {
      const filter = filters2[i];
      const isRemoveHidden = filters2.length === 1 && i === 0;
      const row = React.createElement(FilterRow, {
        key: `filterRow${i}`,
        filter,
        index: i,
        isRemoveHidden,
        tableColumns,
        onChange: handleChange,
        addOnClick: handleAddOnClick,
        removeOnClick: handleRemoveOnClick,
      });
      rows.push(row);
    }

    return ReactUtils.createTable(rows, "filterTable");
  }

  handleAddOnClickFunction(index) {
    const { filters, onChange, tableColumns } = this.props;
    const firstColumn = tableColumns[0];
    let newFilterClause;

    switch (firstColumn.type) {
      case FilterClauseType.BOOLEAN:
        newFilterClause = FilterClause.create({
          columnKey: firstColumn.key,
          operatorKey: Object.keys(BFO.properties)[0],
        });
        break;
      case FilterClauseType.NUMBER:
        newFilterClause = FilterClause.create({
          columnKey: firstColumn.key,
          operatorKey: Object.keys(NFO.properties)[0],
          rhs: 0,
        });
        break;
      case FilterClauseType.STRING:
      case undefined:
        newFilterClause = FilterClause.create({
          columnKey: firstColumn.key,
          operatorKey: Object.keys(SFO.properties)[0],
          rhs: "",
        });
        break;
      default:
        throw new Error(`Unknown firstColumn.type: ${firstColumn.type}`);
    }

    const newFilterClauses = R.insert(index + 1, newFilterClause, filters);
    onChange(newFilterClauses);
  }

  handleChangeFunction(filter, index) {
    const { filters, onChange } = this.props;
    const newFilterClauses = R.update(index, filter, filters);

    onChange(newFilterClauses);
  }

  handleRemoveOnClickFunction(index) {
    const { filters, onChange } = this.props;
    const newFilterClauses = R.remove(index, 1, filters);

    onChange(newFilterClauses);
  }

  render() {
    const filterTable = ReactUtils.createCell(
      this.createTable(),
      "filterTable",
      "inner-table"
    );
    const rows0 = ReactUtils.createRow(filterTable, "filterTableCells");
    const table0 = ReactUtils.createTable(rows0, "filterTableRow");
    const cell0 = ReactUtils.createCell(table0, "filterTable");
    const cell1 = ReactUtils.createCell(
      this.createButtonTable(),
      "buttonTable",
      "button-panel"
    );

    const rows = [
      ReactUtils.createRow(cell0, "filterTablesRow"),
      ReactUtils.createRow(cell1, "buttonRow"),
    ];

    return ReactUtils.createTable(rows, "filterTable", "frt-filter");
  }
}

FilterClauseUI.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  applyOnClick: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,
};

export default FilterClauseUI;
