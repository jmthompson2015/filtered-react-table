(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FilteredReactTable = factory());
}(this, function () { 'use strict';

  const ActionType = {};

  ActionType.APPLY_FILTERS = "applyFilters";
  ActionType.REMOVE_FILTERS = "removeFilters";
  ActionType.SET_DEFAULT_FILTERS = "setDefaultFilters";
  ActionType.SET_FILTERS = "setFilters";
  ActionType.SET_TABLE_COLUMNS = "setTableColumns";
  ActionType.SET_TABLE_ROWS = "setTableRows";

  Object.freeze(ActionType);

  const ActionCreator = {};

  // See https://redux.js.org/recipes/reducing-boilerplate
  const makeActionCreator = (type, ...argNames) => (...args) => {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };

  ActionCreator.applyFilters = makeActionCreator(ActionType.APPLY_FILTERS);

  ActionCreator.removeFilters = makeActionCreator(ActionType.REMOVE_FILTERS);

  ActionCreator.setDefaultFilters = makeActionCreator(ActionType.SET_DEFAULT_FILTERS);

  ActionCreator.setFilters = makeActionCreator(ActionType.SET_FILTERS, "filters");

  ActionCreator.setTableColumns = makeActionCreator(ActionType.SET_TABLE_COLUMNS, "tableColumns");

  ActionCreator.setTableRows = makeActionCreator(ActionType.SET_TABLE_ROWS, "tableData");

  Object.freeze(ActionCreator);

  const AppState = {};

  AppState.create = ({
    filteredTableRows = [],
    filters = [],
    tableColumns = [],
    tableRows = []
  } = {}) =>
    Immutable({
      filteredTableRows,
      filters,
      tableColumns,
      tableRows
    });

  Object.freeze(AppState);

  const NumberFilterOperator = {
    IS: "nfoIs",
    IS_NOT: "nfoIsNot",
    IS_GREATER_THAN: "nfoIsGreaterThan",
    IS_LESS_THAN: "nfoIsLessThan",
    IS_IN_THE_RANGE: "nfoIsInTheRange"
  };

  NumberFilterOperator.properties = {
    nfoIs: {
      label: "is",
      compareFunction: (lhs, rhs) => lhs === rhs,
      key: "nfoIs"
    },
    nfoIsNot: {
      label: "is not",
      compareFunction: (lhs, rhs) => lhs !== rhs,
      key: "nfoIsNot"
    },
    nfoIsGreaterThan: {
      label: "is greater than",
      compareFunction: (lhs, rhs) => lhs > rhs,
      key: "nfoIsGreaterThan"
    },
    nfoIsLessThan: {
      label: "is less than",
      compareFunction: (lhs, rhs) => lhs < rhs,
      key: "nfoIsLessThan"
    },
    nfoIsInTheRange: {
      label: "is in the range",
      compareFunction: (lhs, min, max) => min <= lhs && lhs <= max,
      key: "nfoIsInTheRange"
    }
  };

  Object.freeze(NumberFilterOperator);

  const StringFilterOperator = {
    CONTAINS: "sfoContains",
    DOES_NOT_CONTAIN: "sfoDoesNotContain",
    IS: "sfoIs",
    IS_NOT: "sfoIsNot",
    BEGINS_WITH: "sfoBeginsWith",
    ENDS_WITH: "sfoEndsWith"
  };

  StringFilterOperator.properties = {
    sfoContains: {
      label: "contains",
      compareFunction: (lhs, rhs) => lhs.includes(rhs),
      key: "sfoContains"
    },
    sfoDoesNotContain: {
      label: "does not contain",
      compareFunction: (lhs, rhs) => !lhs.includes(rhs),
      key: "sfoDoesNotContain"
    },
    sfoIs: {
      label: "is",
      compareFunction: (lhs, rhs) => lhs === rhs,
      key: "sfoIs"
    },
    sfoIsNot: {
      label: "is not",
      compareFunction: (lhs, rhs) => lhs !== rhs,
      key: "sfoIsNot"
    },
    sfoBeginsWith: {
      label: "begins with",
      compareFunction: (lhs, rhs) => lhs.startsWith(rhs),
      key: "sfoBeginsWith"
    },
    sfoEndsWith: {
      label: "ends with",
      compareFunction: (lhs, rhs) => lhs.endsWith(rhs),
      key: "sfoEndsWith"
    }
  };

  Object.freeze(StringFilterOperator);

  const Filter = {};

  const operator = opKey => NumberFilterOperator.properties[opKey] || StringFilterOperator.properties[opKey];

  const compareFunction = opKey => operator(opKey).compareFunction;

  Filter.create = ({ columnKey, operatorKey, rhs, rhs2 }) =>
    Immutable({
      columnKey,
      operatorKey,
      rhs,
      rhs2
    });

  Filter.isNumberFilter = filter =>
    filter !== undefined && Object.keys(NumberFilterOperator.properties).includes(filter.operatorKey);

  Filter.isStringFilter = filter =>
    filter !== undefined && Object.keys(StringFilterOperator.properties).includes(filter.operatorKey);

  Filter.passes = (filter, data) => {
    const value = data[filter.columnKey];

    return value === undefined
      ? true
      : compareFunction(filter.operatorKey)(value, filter.rhs, filter.rhs2);
  };

  Filter.passesAll = (filters, data) => {
    let answer = true;
    const propertyNames = Object.keys(filters);

    for (let i = 0; i < propertyNames.length; i += 1) {
      const propertyName = propertyNames[i];
      const filter = filters[propertyName];
      const passes = Filter.passes(filter, data);

      if (!passes) {
        answer = false;
        break;
      }
    }

    return answer;
  };

  Filter.toString = filter => {
    const rhs = Filter.isStringFilter(filter) ? `"${filter.rhs}"` : `${filter.rhs}`;
    const rhs2 = filter.rhs2 ? ` ${filter.rhs}` : "";

    return `Filter (${filter.columnKey} ${operator(filter.operatorKey).label} ${rhs}${rhs2})`;
  };

  Object.freeze(Filter);

  /* eslint no-console: ["error", { allow: ["log", "warn"] }] */

  const Reducer = {};

  Reducer.root = (state, action) => {
    // LOGGER.debug(`root() type = ${action.type}`);

    if (typeof state === "undefined") {
      return AppState.create({ filters: Reducer.loadFromLocalStorage() });
    }

    let newFilteredTableRows;
    let newFilters;
    let newTableRows;

    switch (action.type) {
      case ActionType.APPLY_FILTERS:
        console.log(`Reducer APPLY_FILTERS`);
        newFilteredTableRows = Reducer.filterTableRows(state.tableRows, state.filters);
        Reducer.saveToLocalStorage(state.filters);
        return R.assoc("filteredTableRows", newFilteredTableRows, state);
      case ActionType.REMOVE_FILTERS:
        console.log("Reducer REMOVE_FILTERS");
        newFilteredTableRows = Reducer.sortTableRows(state.tableRows);
        return R.assoc("filteredTableRows", newFilteredTableRows, state);
      case ActionType.SET_DEFAULT_FILTERS:
        console.log("Reducer SET_DEFAULT_FILTERS");
        // newFilters = DefaultFilters.create(state.tableColumns);
        newFilters = [];
        return R.assoc("filters", newFilters, state);
      case ActionType.SET_FILTERS:
        console.log(`Reducer SET_FILTERS`);
        Reducer.saveToLocalStorage(action.filters);
        return R.assoc("filters", action.filters, state);
      case ActionType.SET_TABLE_COLUMNS:
        console.log(`Reducer SET_TABLE_COLUMNS`);
        return R.assoc("tableColumns", action.tableColumns, state);
      case ActionType.SET_TABLE_ROWS:
        console.log(`Reducer SET_TABLE_ROWS`);
        newTableRows = R.concat(state.tableRows, action.tableData);
        return R.pipe(
          R.assoc("tableRows", newTableRows),
          R.assoc("filteredTableRows", newTableRows)
        )(state);
      default:
        console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
        return state;
    }
  };

  Reducer.filterTableRows = (tableRows, filters) => {
    const answer = R.filter(data => Filter.passesAll(filters, data), tableRows);

    return Reducer.sortTableRows(answer);
  };

  Reducer.loadFromLocalStorage = () =>
    localStorage.filters ? JSON.parse(localStorage.filters) : undefined;

  Reducer.saveToLocalStorage = filters => {
    localStorage.filters = JSON.stringify(filters);
  };

  Reducer.sortTableRows = tableRows => R.sort(R.ascend(R.prop("boardGameRank")), tableRows);

  Object.freeze(Reducer);

  const ReactUtilities = {};

  ReactUtilities.createButton = (element, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className
    });

    return ReactDOMFactories.button(newProps, element);
  };

  ReactUtilities.createCell = (element, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className: `dtc${className ? ` ${className}` : ""}`
    });

    return ReactDOMFactories.div(newProps, element);
  };

  ReactUtilities.createFlexbox = (cells, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className: `flex${className ? ` ${className}` : ""}`
    });

    return ReactDOMFactories.div(newProps, cells);
  };

  ReactUtilities.createFlexboxWrap = (cells, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className: `flex flex-wrap${className ? ` ${className}` : ""}`
    });

    return ReactDOMFactories.div(newProps, cells);
  };

  ReactUtilities.createImg = (src, key, className, props = {}) => {
    const newProps = R.merge(props, {
      src,
      key,
      className
    });

    return ReactDOMFactories.img(newProps);
  };

  ReactUtilities.createRow = (cells, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className: `dt-row${className ? ` ${className}` : ""}`
    });

    return ReactDOMFactories.div(newProps, cells);
  };

  ReactUtilities.createSpan = (element, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className
    });

    return ReactDOMFactories.span(newProps, element);
  };

  ReactUtilities.createTable = (rows, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className: `dt${className ? ` ${className}` : ""}`
    });

    return ReactDOMFactories.div(newProps, rows);
  };

  const determineCell = (column, row, value) =>
    column.cellFunction ? column.cellFunction(row) : value;

  const determineValue = (column, row) =>
    column.valueFunction ? column.valueFunction(row) : row[column.key];

  const filterTableColumns = tableColumns => {
    const reduceFunction1 = (accum1, column) => {
      const reduceFunction0 = (accum0, key) => {
        if (["cellFunction", "convertFunction", "defaultFilter"].includes(key)) {
          return accum0;
        }
        const value = column[key];

        return R.assoc(key, value, accum0);
      };
      const newColumn = R.reduce(reduceFunction0, {}, Object.keys(column));

      return R.append(newColumn, accum1);
    };

    return R.reduce(reduceFunction1, [], tableColumns);
  };

  class DataTable extends React.Component {
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
        const cell = determineCell(column, data, value);
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

      return this.Table({ className: "dataTable", columns: myTableColumns, sortable: true }, rows);
    }

    render() {
      const { rowData } = this.props;

      const rowCount = `Row Count: ${rowData.length}`;
      const table = this.createTable(rowData);

      const rows = [
        ReactUtilities.createRow(ReactUtilities.createCell(rowCount, "top", "rowCount"), "topRow"),
        ReactUtilities.createRow(ReactUtilities.createCell(table), "tableRow"),
        ReactUtilities.createRow(ReactUtilities.createCell(rowCount, "bottom", "rowCount"), "bottomRow")
      ];

      return ReactUtilities.createTable(rows);
    }
  }

  DataTable.propTypes = {
    rowData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  const mapStateToProps = state => ({
    rowData: state.filteredTableRows,
    tableColumns: state.tableColumns
  });

  var DataTableContainer = ReactRedux.connect(mapStateToProps)(DataTable);

  const EnumUtilities = {};

  EnumUtilities.findByName = (name, enumClass) => EnumUtilities.findByProp("name", name, enumClass);

  EnumUtilities.findByProp = (propertyName, propertyValue, enumClass) =>
    R.find(R.propEq(propertyName, propertyValue), EnumUtilities.values(enumClass));

  EnumUtilities.keys = enumClass => Object.keys(enumClass.properties);

  EnumUtilities.values = enumClass => Object.values(enumClass.properties);

  Object.freeze(EnumUtilities);

  const TableColumnUtilities = {};

  TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
    const columns = R.filter(c => c.key === columnKey, tableColumns);

    return columns.length > 0 ? columns[0] : undefined;
  };

  Object.freeze(TableColumnUtilities);

  class NumberInput extends React.Component {
    constructor(props) {
      super(props);

      const { initialValue } = this.props;
      this.state = { value: initialValue };

      this.handleBlur = this.handleBlurFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
    }

    handleBlurFunction() {
      const { onBlur } = this.props;
      const { value } = this.state;

      onBlur(value);
    }

    handleChangeFunction(event) {
      const { value } = event.target;

      this.setState({ value });
    }

    render() {
      const { className, id, initialValue } = this.props;

      return ReactDOMFactories.input({
        id,
        type: "number",
        className,
        defaultValue: initialValue,
        onBlur: this.handleBlur,
        onChange: this.handleChange
      });
    }
  }

  NumberInput.propTypes = {
    onBlur: PropTypes.func.isRequired,

    id: PropTypes.string,
    className: PropTypes.string,
    initialValue: PropTypes.number
  };

  NumberInput.defaultProps = {
    id: "numberInput",
    className: undefined,
    initialValue: 0
  };

  const createOption = (key, label) => ReactDOMFactories.option({ key, value: key }, label);

  class Select extends React.Component {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChangeFunction.bind(this);
    }

    handleChangeFunction() {
      const { id, onChange } = this.props;
      const valueSelect = document.getElementById(id);
      const selected = valueSelect.options[valueSelect.selectedIndex].value;
      onChange(selected);
    }

    render() {
      const { id, values, initialValue } = this.props;
      const options = R.map(value => createOption(value.key, value.label), values);

      return ReactDOMFactories.select(
        { id, defaultValue: initialValue, onChange: this.handleChange },
        options
      );
    }
  }

  Select.propTypes = {
    values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onChange: PropTypes.func.isRequired,

    id: PropTypes.string,
    initialValue: PropTypes.string
  };

  Select.defaultProps = {
    id: "select",
    initialValue: undefined
  };

  class StringInput extends React.Component {
    constructor(props) {
      super(props);

      const { initialValue } = this.props;
      this.state = { value: initialValue };

      this.handleBlur = this.handleBlurFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
    }

    handleBlurFunction() {
      const { onBlur } = this.props;
      const { value } = this.state;

      onBlur(value);
    }

    handleChangeFunction(event) {
      const { value } = event.target;

      this.setState({ value });
    }

    render() {
      const { className, id, initialValue } = this.props;

      return ReactDOMFactories.input({
        id,
        type: "text",
        className,
        defaultValue: initialValue,
        onBlur: this.handleBlur,
        onChange: this.handleChange
      });
    }
  }

  StringInput.propTypes = {
    onBlur: PropTypes.func.isRequired,

    id: PropTypes.string,
    className: PropTypes.string,
    initialValue: PropTypes.string
  };

  StringInput.defaultProps = {
    id: "stringInput",
    className: undefined,
    initialValue: ""
  };

  const columnFor = (tableColumns, filter) => {
    const firstColumnKey = Object.values(tableColumns)[0].key;
    const columnKey = filter ? filter.columnKey || firstColumnKey : firstColumnKey;

    return TableColumnUtilities.tableColumn(tableColumns, columnKey);
  };

  const operatorsFor = column => {
    let answer;

    switch (column.type) {
      case "number":
        answer = NumberFilterOperator;
        break;
      default:
        answer = StringFilterOperator;
    }

    return EnumUtilities.values(answer);
  };

  const createAddButton = handleOnClick => ReactDOMFactories.button({ onClick: handleOnClick }, "+");

  const createColumnSelect = (tableColumns, filter, index, column, handleChange) =>
    React.createElement(Select, {
      id: `columnSelect${index}`,
      values: tableColumns,
      initialValue: column.key,
      onChange: handleChange
    });

  const createOperatorSelect = (filter, index, column, handleChange) => {
    const operators = operatorsFor(column);

    return React.createElement(Select, {
      id: `operatorSelect${index}`,
      values: operators,
      initialValue: filter ? filter.operatorKey : undefined,
      onChange: handleChange
    });
  };

  const createFilterUI = (filter, index, column, handleChange) => {
    const idKey = `rhsField${index}`;

    if (column.type === "number") {
      if (filter.operatorKey === NumberFilterOperator.IS_IN_THE_RANGE) {
        return [
          ReactUtilities.createCell(
            React.createElement(NumberInput, {
              id: idKey,
              className: "filterField",
              initialValue: filter ? filter.rhs : undefined,
              onBlur: handleChange
            }),
            `rhs1NumberField${index}`
          ),
          ReactUtilities.createCell("to", "toField", "pl2 pr2"),
          ReactUtilities.createCell(
            React.createElement(NumberInput, {
              id: `rhs2Field${index}`,
              className: "filterField",
              initialValue: filter ? filter.rhs2 : undefined,
              onBlur: handleChange
            }),
            `rhs2NumberField${index}`
          )
        ];
      }

      return ReactUtilities.createCell(
        React.createElement(NumberInput, {
          id: idKey,
          className: "filterField",
          initialValue: filter ? filter.rhs : undefined,
          onBlur: handleChange
        }),
        `rhsNumberField${index}`
      );
    }

    return ReactUtilities.createCell(
      React.createElement(StringInput, {
        id: idKey,
        className: "filterField",
        initialValue: filter ? filter.rhs : undefined,
        onBlur: handleChange
      }),
      `rhsStringField${index}`
    );
  };

  const createRemoveButton = (isRemoveHidden, handleOnClick) =>
    ReactDOMFactories.button({ hidden: isRemoveHidden, onClick: handleOnClick }, "-");

  class FilterRow extends React.Component {
    constructor(props) {
      super(props);

      this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
      this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
    }

    handleAddOnClickFunction() {
      const { addOnClick, index } = this.props;
      addOnClick(index);
    }

    handleChangeFunction() {
      const { index, onChange, tableColumns } = this.props;
      const columnKey = document.getElementById(`columnSelect${index}`).value;
      const operatorKey = document.getElementById(`operatorSelect${index}`).value;
      const rhs = document.getElementById(`rhsField${index}`).value;

      let rhs2;
      const rhs2Element = document.getElementById(`rhs2Field${index}`);

      if (rhs2Element) {
        rhs2 = rhs2Element.value;
      }

      let newFilter;
      const column = TableColumnUtilities.tableColumn(tableColumns, columnKey);

      if (column.type === "number") {
        newFilter = Filter.create({
          columnKey,
          operatorKey,
          rhs: parseInt(rhs, 10),
          rhs2: rhs2 ? parseInt(rhs2, 10) : undefined
        });
      } else {
        newFilter = Filter.create({
          columnKey,
          operatorKey,
          rhs
        });
      }

      onChange(newFilter, index);
    }

    handleRemoveOnClickFunction() {
      const { removeOnClick, index } = this.props;
      removeOnClick(index);
    }

    render() {
      const { filter, index, isRemoveHidden, tableColumns } = this.props;
      const column = columnFor(tableColumns, filter);

      const columnSelect = ReactUtilities.createCell(
        createColumnSelect(tableColumns, filter, index, column, this.handleChange),
        `${column.key}ColumnSelectCell${index}`
      );
      const operatorSelect = ReactUtilities.createCell(
        createOperatorSelect(filter, index, column, this.handleChange),
        `${column.key}OperatorSelectCell${index}`
      );
      const filterUI = createFilterUI(filter, index, column, this.handleChange);
      const removeButton = ReactUtilities.createCell(
        createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
        `removeButtonCell${index}`
      );
      const addButton = ReactUtilities.createCell(
        createAddButton(this.handleAddOnClick),
        `addButtonCell${index}`
      );

      const cells = [columnSelect, operatorSelect, filterUI, removeButton, addButton];

      return ReactUtilities.createRow(cells, `${column.key}FilterRow${index}`);
    }
  }

  FilterRow.propTypes = {
    onChange: PropTypes.func.isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

    addOnClick: PropTypes.func.isRequired,
    removeOnClick: PropTypes.func.isRequired,

    filter: PropTypes.shape(),
    index: PropTypes.number,
    isRemoveHidden: PropTypes.bool
  };

  FilterRow.defaultProps = {
    filter: undefined,
    index: undefined,
    isRemoveHidden: false
  };

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
        ReactUtilities.createCell(filterCacheButton, "filterCacheButton", "pa1"),
        ReactUtilities.createCell(restoreButton, "restoreButton", "pa1"),
        ReactUtilities.createCell(unfilterButton, "unfilterButton", "pa1"),
        ReactUtilities.createCell(filterButton, "filterButton", "pa1")
      ];
      const row = ReactUtilities.createRow(cells);

      return ReactUtilities.createTable(row, "buttonTable", "f6 fr");
    }

    createTable() {
      const rows = [];

      const { filters, tableColumns } = this.props;
      const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;

      if (filters.length === 0) {
        const firstColumn = tableColumns[0];
        let newFilter;

        if (firstColumn.type === undefined || firstColumn.type === "string") {
          const firstOpKey = Object.keys(StringFilterOperator.properties)[0];
          newFilter = Filter.create({
            columnKey: firstColumn.key,
            operatorKey: firstOpKey,
            rhs: ""
          });
        } else if (firstColumn.type === "number") {
          const firstOpKey = Object.keys(NumberFilterOperator.properties)[0];
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

      return ReactUtilities.createTable(rows, "filterTable", "gf-bg-light2 f6 mh1");
    }

    handleAddOnClickFunction(index) {
      const { filters, onChange, tableColumns } = this.props;
      const firstColumn = tableColumns[0];
      let newFilter;

      if (firstColumn.type === "number") {
        const firstOperatorKey = Object.keys(NumberFilterOperator.properties)[0];
        newFilter = Filter.create({
          columnKey: firstColumn.key,
          operatorKey: firstOperatorKey,
          rhs: 0
        });
      } else {
        const firstOperatorKey = Object.keys(StringFilterOperator.properties)[0];
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
      const filterTable = ReactUtilities.createCell(this.createTable(), "filterTable", "v-top");
      const rows0 = ReactUtilities.createRow(filterTable, "filterTableCells");
      const table0 = ReactUtilities.createTable(rows0, "filterTableRow");
      const cell0 = ReactUtilities.createCell("Filter", "filterTitle", "b f4 gf-light2 pa1 tl");
      const cell1 = ReactUtilities.createCell(table0, "filterTable");
      const cell2 = ReactUtilities.createCell(this.createButtonTable(), "buttonTable", "center pa2");

      const rows = [
        ReactUtilities.createRow(cell0, "filterTitleRow"),
        ReactUtilities.createRow(cell1, "filterTablesRow"),
        ReactUtilities.createRow(cell2, "buttonRow")
      ];

      return ReactUtilities.createTable(rows, "filterTable", "gf-bg-dark1 gf-f-entity pa1");
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

  const mapStateToProps$1 = state => {
    const { categoryMap, designerMap, filters, mechanicMap, tableColumns, userMap } = state;
    const myTableColumns = R.filter(c => c.type !== "none", tableColumns);

    return {
      filters,
      tableColumns: myTableColumns,

      categoryMap,
      designerMap,
      mechanicMap,
      userMap
    };
  };

  const mapDispatchToProps = (dispatch /* , ownProps */) => ({
    applyOnClick: () => {
      console.log("applyOnClick()");
      dispatch(ActionCreator.applyFilters());
    },
    clearCacheOnClick: () => {
      console.log("clearCacheOnClick()");
      localStorage.removeItem("filters");
    },
    onChange: filters => {
      console.log("FilterContainer onChange()");
      dispatch(ActionCreator.setFilters(filters));
    },
    removeOnClick: () => {
      console.log("removeOnClick()");
      dispatch(ActionCreator.removeFilters());
    },
    restoreDefaultsOnClick: () => {
      console.log("restoreDefaultsOnClick()");
      dispatch(ActionCreator.setDefaultFilters());
    }
  });

  var FilterContainer = ReactRedux.connect(
    mapStateToProps$1,
    mapDispatchToProps
  )(FilterUI);

  const convert = (tableColumns, tableRows) => {
    const mapFunction = row => {
      const reduceFunction = (accum, column) => {
        const value = column.convertFunction ? column.convertFunction(row) : row[column.key];

        return R.assoc(column.key, value, accum);
      };

      return R.reduce(reduceFunction, {}, tableColumns);
    };

    return R.map(mapFunction, tableRows);
  };

  const hasConvertFunctions = tableColumns => {
    const reduceFunction = (accum, column) =>
      column.convertFunction ? R.append(column.convertFunction, accum) : accum;
    const convertFunctions = R.reduce(reduceFunction, [], tableColumns);

    return convertFunctions.length > 0;
  };

  const verifyParameter = (name, value) => {
    if (value === undefined) {
      throw new Error(`Undefined parameter: ${name}`);
    }

    if (!Array.isArray(value)) {
      throw new Error(`Parameter not an array: ${name}`);
    }
  };

  class FilteredReactTable {
    constructor(tableColumns, tableRows) {
      verifyParameter("tableColumns", tableColumns);
      verifyParameter("tableRows", tableRows);

      const tableRows2 = hasConvertFunctions(tableColumns)
        ? convert(tableColumns, tableRows)
        : tableRows;

      this.store = Redux.createStore(Reducer.root);

      this.store.dispatch(ActionCreator.setTableColumns(tableColumns));
      this.store.dispatch(ActionCreator.setTableRows(tableRows2));
      this.store.dispatch(ActionCreator.setDefaultFilters());
    }

    filterElement() {
      const container = React.createElement(FilterContainer);

      return React.createElement(ReactRedux.Provider, { store: this.store }, container);
    }

    tableElement() {
      const container = React.createElement(DataTableContainer);

      return React.createElement(ReactRedux.Provider, { store: this.store }, container);
    }
  }

  return FilteredReactTable;

}));
