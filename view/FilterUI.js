import BFO from "../state/BooleanFilterOperator.js";
import Filter from "../state/Filter.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";

import FilterRow from "./FilterRow.js";
import ReactUtils from "./ReactUtilities.js";

class FilterUI extends React.Component {
  constructor(props) {
    super(props);

    this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
    this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
  }

  createButtonTable() {
    const { applyOnClick, clearCacheOnClick, removeOnClick, restoreDefaultsOnClick } = this.props;

    const filterCacheButton = ReactDOMFactories.button(
      { onClick: clearCacheOnClick },
      "Clear Cache"
    );
    const restoreButton = ReactDOMFactories.button(
      { onClick: restoreDefaultsOnClick },
      "Restore Defaults"
    );
    const unfilterButton = ReactDOMFactories.button({ onClick: removeOnClick }, "Remove");
    const filterButton = ReactDOMFactories.button({ onClick: applyOnClick }, "Apply");

    const cells = [
      ReactUtils.createCell(filterCacheButton, "filterCacheButton", "pa1"),
      ReactUtils.createCell(restoreButton, "restoreButton", "pa1"),
      ReactUtils.createCell(unfilterButton, "unfilterButton", "pa1"),
      ReactUtils.createCell(filterButton, "filterButton", "pa1")
    ];
    const row = ReactUtils.createRow(cells);

    return ReactUtils.createTable(row, "buttonTable", "f6 fr");
  }

  createTable() {
    const rows = [];

    const { filters, tableColumns } = this.props;
    const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;

    if (filters.length === 0) {
      const firstColumn = tableColumns[0];
      let newFilter;

      if (firstColumn.type === undefined || firstColumn.type === "string") {
        const firstOpKey = Object.keys(SFO.properties)[0];
        newFilter = Filter.create({
          columnKey: firstColumn.key,
          operatorKey: firstOpKey,
          rhs: ""
        });
      } else if (firstColumn.type === "boolean") {
        const firstOpKey = Object.keys(BFO.properties)[0];
        newFilter = Filter.create({
          columnKey: firstColumn.key,
          operatorKey: firstOpKey
        });
      } else if (firstColumn.type === "number") {
        const firstOpKey = Object.keys(NFO.properties)[0];
        newFilter = Filter.create({
          columnKey: firstColumn.key,
          operatorKey: firstOpKey,
          rhs: 0
        });
      }

      filters.push(newFilter);
    }

    for (let i = 0; i < filters.length; i += 1) {
      const filter = filters[i];
      const isRemoveHidden = filters.length === 1 && i === 0;
      const row = React.createElement(FilterRow, {
        key: `filterRow${i}`,
        filter,
        index: i,
        isRemoveHidden,
        tableColumns,
        onChange: handleChange,
        addOnClick: handleAddOnClick,
        removeOnClick: handleRemoveOnClick
      });
      rows.push(row);
    }

    return ReactUtils.createTable(rows, "filterTable", "gf-bg-light2 f6 mh1");
  }

  handleAddOnClickFunction(index) {
    const { filters, onChange, tableColumns } = this.props;
    const firstColumn = tableColumns[0];
    let newFilter;

    if (firstColumn.type === "boolean") {
      const firstOperatorKey = Object.keys(BFO.properties)[0];
      newFilter = Filter.create({
        columnKey: firstColumn.key,
        operatorKey: firstOperatorKey
      });
    } else if (firstColumn.type === "number") {
      const firstOperatorKey = Object.keys(NFO.properties)[0];
      newFilter = Filter.create({
        columnKey: firstColumn.key,
        operatorKey: firstOperatorKey,
        rhs: 0
      });
    } else {
      const firstOperatorKey = Object.keys(SFO.properties)[0];
      newFilter = Filter.create({
        columnKey: firstColumn.key,
        operatorKey: firstOperatorKey,
        rhs: ""
      });
    }

    const newFilters = R.insert(index + 1, newFilter, filters);
    onChange(newFilters);
  }

  handleChangeFunction(filter, index) {
    const { filters, onChange } = this.props;
    const newFilters = R.update(index, filter, filters);

    onChange(newFilters);
  }

  handleRemoveOnClickFunction(index) {
    const { filters, onChange } = this.props;
    const newFilters = R.remove(index, 1, filters);

    onChange(newFilters);
  }

  render() {
    const filterTable = ReactUtils.createCell(this.createTable(), "filterTable", "v-top");
    const rows0 = ReactUtils.createRow(filterTable, "filterTableCells");
    const table0 = ReactUtils.createTable(rows0, "filterTableRow");
    const cell0 = ReactUtils.createCell("Filter", "filterTitle", "b f4 gf-light2 pa1 tl");
    const cell1 = ReactUtils.createCell(table0, "filterTable");
    const cell2 = ReactUtils.createCell(this.createButtonTable(), "buttonTable", "center pa2");

    const rows = [
      ReactUtils.createRow(cell0, "filterTitleRow"),
      ReactUtils.createRow(cell1, "filterTablesRow"),
      ReactUtils.createRow(cell2, "buttonRow")
    ];

    return ReactUtils.createTable(rows, "filterTable", "gf-bg-dark1 gf-f-entity pa1");
  }
}

FilterUI.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  onChange: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  applyOnClick: PropTypes.func.isRequired,
  clearCacheOnClick: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,
  restoreDefaultsOnClick: PropTypes.func.isRequired
};

export default FilterUI;
