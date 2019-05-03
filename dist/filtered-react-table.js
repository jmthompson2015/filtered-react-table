(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FilteredReactTable = factory());
}(this, function () { 'use strict';

  const ActionType = {};

  ActionType.APPLY_FILTERS = "applyFilters";
  ActionType.APPLY_SHOW_COLUMNS = "applyShowColumns";
  ActionType.REMOVE_FILTERS = "removeFilters";
  ActionType.SET_APP_NAME = "setAppName";
  ActionType.SET_FILTERS = "setFilters";
  ActionType.SET_TABLE_COLUMNS = "setTableColumns";
  ActionType.SET_TABLE_ROWS = "setTableRows";
  ActionType.SET_VERBOSE = "setVerbose";

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

  ActionCreator.applyShowColumns = makeActionCreator(
    ActionType.APPLY_SHOW_COLUMNS,
    "columnToChecked"
  );

  ActionCreator.removeFilters = makeActionCreator(ActionType.REMOVE_FILTERS);

  ActionCreator.setAppName = makeActionCreator(ActionType.SET_APP_NAME, "appName");

  ActionCreator.setFilters = makeActionCreator(ActionType.SET_FILTERS, "filters");

  ActionCreator.setTableColumns = makeActionCreator(ActionType.SET_TABLE_COLUMNS, "tableColumns");

  ActionCreator.setTableRows = makeActionCreator(ActionType.SET_TABLE_ROWS, "tableRows");

  ActionCreator.setVerbose = makeActionCreator(ActionType.SET_VERBOSE, "isVerbose");

  Object.freeze(ActionCreator);

  // see https://github.com/reactjs/redux/issues/303#issuecomment-125184409
  const Observer = {};

  Observer.observeStore = (store, select, onChange) => {
    let currentState;

    const handleChange = () => {
      const nextState = select(store.getState());

      if (nextState !== currentState) {
        currentState = nextState;
        onChange(nextState);
      }
    };

    const unsubscribe = store.subscribe(handleChange);

    handleChange();

    return unsubscribe;
  };

  Object.freeze(Observer);

  const Preferences = {};

  const fetchItem = appName => {
    const oldItemString = localStorage.getItem(appName);

    return oldItemString !== undefined ? JSON.parse(oldItemString) : {};
  };

  Preferences.getColumnToChecked = appName => {
    const item = fetchItem(appName);

    return item && item.columnToChecked ? Immutable(item.columnToChecked) : Immutable({});
  };

  Preferences.setColumnToChecked = (appName, columnToChecked) => {
    const oldItem = fetchItem(appName);
    const newItem = R.merge(oldItem, { columnToChecked });

    localStorage.setItem(appName, JSON.stringify(newItem));
  };

  Preferences.getFilters = appName => {
    const item = fetchItem(appName);

    return item && item.filters ? Immutable(item.filters) : Immutable([]);
  };

  Preferences.setFilters = (appName, filters) => {
    const oldItem = fetchItem(appName);
    const newItem = R.merge(oldItem, { filters });

    localStorage.setItem(appName, JSON.stringify(newItem));
  };

  Object.freeze(Preferences);

  const AppState = {};

  AppState.create = ({
    appName = "FilteredReactTable",
    columnToChecked = {},
    filteredTableRows = [],
    filters = [],
    isVerbose = false,
    tableColumns = [],
    tableRows = []
  } = {}) =>
    Immutable({
      appName,
      columnToChecked,
      filteredTableRows,
      filters,
      isVerbose,
      tableColumns,
      tableRows
    });

  Object.freeze(AppState);

  const BooleanFilterOperator = {
    IS_TRUE: "bfoIsTrue",
    IS_FALSE: "bfoIsFalse"
  };

  BooleanFilterOperator.properties = {
    bfoIsTrue: {
      label: "is true",
      compareFunction: lhs => lhs === true,
      key: "bfoIsTrue"
    },
    bfoIsFalse: {
      label: "is false",
      compareFunction: lhs => lhs === false,
      key: "bfoIsFalse"
    }
  };

  Object.freeze(BooleanFilterOperator);

  const FilterType = {
    BOOLEAN: "boolean",
    NUMBER: "number",
    STRING: "string"
  };

  FilterType.properties = {
    boolean: {
      name: "Boolean",
      key: "boolean"
    },
    number: {
      name: "Number",
      key: "number"
    },
    string: {
      name: "String",
      key: "string"
    }
  };

  Object.freeze(FilterType);

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

  const myCompareFunction = (lhs, rhs, myFunction) => {
    if (lhs === undefined || rhs === undefined) return false;

    const value = Array.isArray(lhs) ? lhs.join(" ") : lhs;

    if (rhs.includes("|")) {
      const parts = rhs.split("|");
      const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
      return R.reduce(reduceFunction, false, parts);
    }

    return myFunction(value, rhs);
  };

  const containsCompareFunction = (lhs, rhs) =>
    myCompareFunction(lhs, rhs, (value, r) => value.includes(r));

  const isCompareFunction = (lhs, rhs) => myCompareFunction(lhs, rhs, (value, r) => value === r);

  StringFilterOperator.properties = {
    sfoContains: {
      label: "contains",
      compareFunction: containsCompareFunction,
      key: "sfoContains"
    },
    sfoDoesNotContain: {
      label: "does not contain",
      compareFunction: (lhs, rhs) => !containsCompareFunction(lhs, rhs),
      key: "sfoDoesNotContain"
    },
    sfoIs: {
      label: "is",
      compareFunction: isCompareFunction,
      key: "sfoIs"
    },
    sfoIsNot: {
      label: "is not",
      compareFunction: (lhs, rhs) => !isCompareFunction(lhs, rhs),
      key: "sfoIsNot"
    },
    sfoBeginsWith: {
      label: "begins with",
      compareFunction: (lhs, rhs) => myCompareFunction(lhs, rhs, (value, r) => value.startsWith(r)),
      key: "sfoBeginsWith"
    },
    sfoEndsWith: {
      label: "ends with",
      compareFunction: (lhs, rhs) => myCompareFunction(lhs, rhs, (value, r) => value.endsWith(r)),
      key: "sfoEndsWith"
    }
  };

  Object.freeze(StringFilterOperator);

  const TableColumnUtilities = {};

  TableColumnUtilities.determineCell = (column, row) =>
    row[`frt-cell-${column.key}`] || TableColumnUtilities.determineValue(column, row);

  TableColumnUtilities.determineValue = (column, row) =>
    row[`frt-value-${column.key}`] || row[column.key];

  TableColumnUtilities.tableColumn = (tableColumns, columnKey) => {
    const columns = R.filter(c => c.key === columnKey, tableColumns);

    return columns.length > 0 ? columns[0] : undefined;
  };

  Object.freeze(TableColumnUtilities);

  const Filter = {};

  const operator = operatorKey =>
    BooleanFilterOperator.properties[operatorKey] || NumberFilterOperator.properties[operatorKey] || StringFilterOperator.properties[operatorKey];

  const compareFunction = operatorKey => operator(operatorKey).compareFunction;

  Filter.create = ({ columnKey, operatorKey, rhs, rhs2 }) =>
    Immutable({
      columnKey,
      operatorKey,
      rhs,
      rhs2
    });

  Filter.isBooleanFilter = filter =>
    filter !== undefined && Object.keys(BooleanFilterOperator.properties).includes(filter.operatorKey);

  Filter.isNumberFilter = filter =>
    filter !== undefined && Object.keys(NumberFilterOperator.properties).includes(filter.operatorKey);

  Filter.isStringFilter = filter =>
    filter !== undefined && Object.keys(StringFilterOperator.properties).includes(filter.operatorKey);

  Filter.passes = (tableColumns, filter, row) => {
    const column = TableColumnUtilities.tableColumn(tableColumns, filter.columnKey);
    if (column === undefined) {
      // eslint-disable-next-line no-console
      console.warn(`Unknown column for filter.columnKey: ${filter.columnKey}`);
    }

    if (column !== undefined) {
      const value = TableColumnUtilities.determineValue(column, row);
      const compare = compareFunction(filter.operatorKey);

      return compare(value, filter.rhs, filter.rhs2);
    }
    return false;
  };

  Filter.passesAll = (tableColumns, filters, row) => {
    let answer = true;
    const propertyNames = Object.keys(filters);

    for (let i = 0; i < propertyNames.length; i += 1) {
      const propertyName = propertyNames[i];
      const filter = filters[propertyName];
      const passes = Filter.passes(tableColumns, filter, row);

      if (!passes) {
        answer = false;
        break;
      }
    }

    return answer;
  };

  Filter.toString = filter => {
    const operatorLabel = operator(filter.operatorKey).label;

    if (Filter.isBooleanFilter(filter)) {
      return `Filter (${filter.columnKey} ${operatorLabel})`;
    }

    if (Filter.isStringFilter(filter)) {
      return `Filter (${filter.columnKey} ${operatorLabel} "${filter.rhs}")`;
    }

    const rhs2 = filter.rhs2 ? ` ${filter.rhs}` : "";
    return `Filter (${filter.columnKey} ${operatorLabel} ${filter.rhs}${rhs2})`;
  };

  Filter.typeKey = filter => {
    let answer;

    if (Filter.isBooleanFilter(filter)) {
      answer = FilterType.BOOLEAN;
    } else if (Filter.isNumberFilter(filter)) {
      answer = FilterType.NUMBER;
    } else if (Filter.isStringFilter(filter)) {
      answer = FilterType.STRING;
    }

    return answer;
  };

  Object.freeze(Filter);

  /* eslint no-console: ["error", { allow: ["log", "warn"] }] */

  const Reducer = {};

  Reducer.root = (state, action) => {
    // LOGGER.debug(`root() type = ${action.type}`);

    if (typeof state === "undefined") {
      return AppState.create();
    }

    let newFilteredTableRows;

    switch (action.type) {
      case ActionType.APPLY_FILTERS:
        if (state.isVerbose) {
          console.log(`Reducer APPLY_FILTERS`);
        }
        newFilteredTableRows = Reducer.filterTableRows(
          state.tableColumns,
          state.tableRows,
          state.filters
        );
        return R.assoc("filteredTableRows", newFilteredTableRows, state);
      case ActionType.APPLY_SHOW_COLUMNS:
        if (state.isVerbose) {
          console.log(
            `Reducer APPLY_SHOW_COLUMNS columnToChecked = ${JSON.stringify(action.columnToChecked)}`
          );
        }
        Preferences.setColumnToChecked(state.appName, Immutable(action.columnToChecked));
        return R.assoc("columnToChecked", action.columnToChecked, state);
      case ActionType.REMOVE_FILTERS:
        if (state.isVerbose) {
          console.log("Reducer REMOVE_FILTERS");
        }
        return R.assoc("filteredTableRows", state.tableRows, state);
      case ActionType.SET_APP_NAME:
        if (state.isVerbose) {
          console.log(`Reducer SET_APP_NAME appName = ${action.appName}`);
        }
        return R.assoc("appName", action.appName, state);
      case ActionType.SET_FILTERS:
        if (state.isVerbose) {
          console.log(`Reducer SET_FILTERS`);
        }
        Preferences.setFilters(state.appName, Immutable(action.filters));
        return R.assoc("filters", action.filters, state);
      case ActionType.SET_TABLE_COLUMNS:
        if (state.isVerbose) {
          console.log(`Reducer SET_TABLE_COLUMNS`);
        }
        return R.assoc("tableColumns", Immutable(action.tableColumns), state);
      case ActionType.SET_TABLE_ROWS:
        if (state.isVerbose) {
          console.log(`Reducer SET_TABLE_ROWS`);
        }
        return R.pipe(
          R.assoc("tableRows", Immutable(action.tableRows)),
          R.assoc("filteredTableRows", Immutable(action.tableRows))
        )(state);
      case ActionType.SET_VERBOSE:
        console.log(`Reducer SET_VERBOSE isVerbose ? ${action.isVerbose}`);
        return R.assoc("isVerbose", action.isVerbose, state);
      default:
        console.warn(`Reducer.root: Unhandled action type: ${action.type}`);
        return state;
    }
  };

  Reducer.filterTableRows = (tableColumns, tableRows, filters) =>
    Immutable(R.filter(data => Filter.passesAll(tableColumns, filters, data), tableRows));

  Object.freeze(Reducer);

  const Selector = {};

  Selector.filteredTableRows = state => state.filteredTableRows;

  Selector.filters = state => state.filters;

  Selector.tableColumns = state => state.tableColumns;

  Selector.tableRows = state => state.tableRows;

  Object.freeze(Selector);

  const ReactUtilities = {};

  ReactUtilities.createCell = (element, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table-cell"
      }
    });

    return ReactDOMFactories.div(newProps, element);
  };

  ReactUtilities.createRow = (cells, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table-row"
      }
    });

    return ReactDOMFactories.div(newProps, cells);
  };

  ReactUtilities.createTable = (rows, key, className, props = {}) => {
    const newProps = R.merge(props, {
      key,
      className,
      style: {
        display: "table"
      }
    });

    return ReactDOMFactories.div(newProps, rows);
  };

  const CLOSED = "\u25B6";
  const OPEN = "\u25BC";

  const createControl = (image, onClick) =>
    ReactDOMFactories.span({ key: "control", className: "control", onClick }, image);

  const createLabel = title => ReactDOMFactories.span({ key: "label", className: "label" }, title);

  const createPanel = child =>
    ReactDOMFactories.div({ key: "childPanel", className: "child-panel" }, child);

  class CollapsiblePanel extends React.PureComponent {
    constructor(props) {
      super(props);

      this.state = { isCollapsed: true };

      this.handleChange = this.handleChangeFunction.bind(this);
    }

    handleChangeFunction() {
      const { isCollapsed } = this.state;

      this.setState({ isCollapsed: !isCollapsed });
    }

    render() {
      const { isCollapsed } = this.state;
      const { child, title } = this.props;

      const image = isCollapsed ? CLOSED : OPEN;
      const control = createControl(image, this.handleChange);
      const label = createLabel(title);

      const cell0 = ReactUtilities.createCell([control, label], "titleCell", "title-cell");
      let answer;

      if (isCollapsed) {
        const row = ReactUtilities.createRow(cell0, "titleRow");
        answer = ReactUtilities.createTable(row, "collapsiblePanel", "frt-collapsible-panel");
      } else {
        const panel = createPanel(child);
        const cell1 = ReactUtilities.createCell(panel, "childCell", "child-cell");
        const rows = [
          ReactUtilities.createRow(cell0, "titleRow"),
          ReactUtilities.createRow(cell1, "childRow")
        ];
        answer = ReactUtilities.createTable(rows, "collapsiblePanel", "frt-collapsible-panel");
      }

      return answer;
    }
  }

  CollapsiblePanel.propTypes = {
    title: PropTypes.string.isRequired,
    child: PropTypes.shape().isRequired
  };

  const determineValue = (column, row) => {
    if (column.type === FilterType.BOOLEAN) {
      if (row[column.key] === true) return "true";
      if (row[column.key] === false) return "false";
      return undefined;
    }
    return TableColumnUtilities.determineValue(column, row);
  };

  const filterTableColumns = (columnToChecked, tableColumns) => {
    const reduceFunction1 = (accum1, column) => {
      if (columnToChecked[column.key]) {
        const reduceFunction0 = (accum0, key) => {
          if (["cellFunction", "convertFunction", "isShown", "valueFunction"].includes(key)) {
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
        const cell = TableColumnUtilities.determineCell(column, data);
        return this.Td(
          { key: column.key + data.id, className: column.className, column: column.key, value },
          cell === undefined ? "" : cell
        );
      };
      const cells = R.map(mapFunction, tableColumns);

      return this.Tr({ key }, cells);
    }

    createTable(rowData) {
      const { columnToChecked, tableColumns } = this.props;

      const myTableColumns = filterTableColumns(columnToChecked, tableColumns);
      const mapFunction = data => this.createRow(data, data.id || data.name);
      const rows = R.map(mapFunction, rowData);

      return this.Table({ className: "frt-table", columns: myTableColumns, sortable: true }, rows);
    }

    render() {
      const { rowData } = this.props;

      const rowCount = `Row Count: ${rowData.length}`;
      const table = this.createTable(rowData);

      const rows = [
        ReactUtilities.createRow(ReactUtilities.createCell(rowCount, "top", "frt-rowCount"), "topRow"),
        ReactUtilities.createRow(ReactUtilities.createCell(table), "tableRow"),
        ReactUtilities.createRow(ReactUtilities.createCell(rowCount, "bottom", "frt-rowCount"), "bottomRow")
      ];

      return ReactUtilities.createTable(rows);
    }
  }

  DataTable.propTypes = {
    columnToChecked: PropTypes.shape().isRequired,
    rowData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired
  };

  const mapStateToProps = state => ({
    columnToChecked: state.columnToChecked,
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

  class NumberInput extends React.PureComponent {
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
      const myValue = Number(value);

      onBlur(myValue);
    }

    handleChangeFunction(event) {
      const { value } = event.target;
      const myValue = Number(value);

      this.setState({ value: myValue });
    }

    render() {
      const { className, id, initialValue, max, min, step } = this.props;

      return ReactDOMFactories.input({
        id,
        type: "number",
        className,
        defaultValue: initialValue,
        max,
        min,
        step,
        onBlur: this.handleBlur,
        onChange: this.handleChange
      });
    }
  }

  NumberInput.propTypes = {
    onBlur: PropTypes.func.isRequired,

    id: PropTypes.string,
    className: PropTypes.string,
    initialValue: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number
  };

  NumberInput.defaultProps = {
    id: "numberInput",
    className: undefined,
    initialValue: 0,
    max: undefined,
    min: undefined,
    step: undefined
  };

  const createOption = (key, label) => ReactDOMFactories.option({ key, value: key }, label);

  class Select extends React.PureComponent {
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

  class StringInput extends React.PureComponent {
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

  const asNumber = value => {
    if (typeof value === "string") {
      return Number(value);
    }
    return value;
  };

  const columnFor = (tableColumns, filter) => {
    const firstColumnKey = Object.values(tableColumns)[0].key;
    const columnKey = filter ? filter.columnKey || firstColumnKey : firstColumnKey;

    return TableColumnUtilities.tableColumn(tableColumns, columnKey);
  };

  const columnFromDocument = (tableColumns, index) => {
    const element = document.getElementById(`columnSelect${index}`);
    const columnKey = element.value;

    return TableColumnUtilities.tableColumn(tableColumns, columnKey);
  };

  const createAddButton = handleOnClick => ReactDOMFactories.button({ onClick: handleOnClick }, "+");

  const createColumnSelect = (tableColumns, filter, index, column, handleChange) =>
    React.createElement(Select, {
      id: `columnSelect${index}`,
      values: tableColumns,
      initialValue: column.key,
      onChange: handleChange
    });

  const createEmptyCell = key => ReactUtilities.createCell("", key);

  const operatorsFor = column => {
    let answer;

    switch (column.type) {
      case FilterType.BOOLEAN:
        answer = BooleanFilterOperator;
        break;
      case FilterType.NUMBER:
        answer = NumberFilterOperator;
        break;
      case FilterType.STRING:
      case undefined:
        answer = StringFilterOperator;
        break;
      default:
        throw new Error(`Unknown column.type: ${column.type}`);
    }

    return EnumUtilities.values(answer);
  };

  const createOperatorSelect = (filter, index, column, handleChange) => {
    const operators = operatorsFor(column);

    return React.createElement(Select, {
      id: `operatorSelect${index}`,
      values: operators,
      initialValue: filter ? filter.operatorKey : undefined,
      onChange: handleChange
    });
  };

  const createBooleanFilterUI = index => [
    createEmptyCell(`rhsBooleanField1${index}`),
    createEmptyCell(`rhsBooleanField2${index}`),
    createEmptyCell(`rhsBooleanField3${index}`)
  ];

  const createNumberFilterUI = (filter, index, handleChange, min, max, step) => {
    const idKey = `rhsField${index}`;
    const rhs = filter ? asNumber(filter.rhs) : undefined;
    if (filter.operatorKey === NumberFilterOperator.IS_IN_THE_RANGE) {
      const rhs2 = filter ? asNumber(filter.rhs2) : undefined;
      return [
        ReactUtilities.createCell(
          React.createElement(NumberInput, {
            id: idKey,
            className: "field",
            initialValue: rhs,
            max,
            min,
            step,
            onBlur: handleChange
          }),
          `rhs1NumberField1${index}`
        ),
        ReactUtilities.createCell(
          ReactDOMFactories.span({ style: { paddingLeft: 3, paddingRight: 3 } }, "to"),
          `toField${index}`
        ),
        ReactUtilities.createCell(
          React.createElement(NumberInput, {
            id: `rhs2Field${index}`,
            className: "field",
            initialValue: rhs2,
            max,
            min,
            step,
            onBlur: handleChange
          }),
          `rhs2NumberField3${index}`
        )
      ];
    }

    return [
      ReactUtilities.createCell(
        React.createElement(NumberInput, {
          id: idKey,
          className: "field",
          initialValue: rhs,
          max,
          min,
          step,
          onBlur: handleChange
        }),
        `rhsNumberField1${index}`
      ),
      createEmptyCell(`rhsNumberField2${index}`),
      createEmptyCell(`rhsNumberField3${index}`)
    ];
  };

  const createStringFilterUI = (filter, index, handleChange) => {
    const idKey = `rhsField${index}`;
    return [
      ReactUtilities.createCell(
        React.createElement(StringInput, {
          id: idKey,
          className: "field",
          initialValue: filter ? filter.rhs : undefined,
          onBlur: handleChange
        }),
        `rhsStringField1${index}`
      ),
      createEmptyCell(`rhsStringField2${index}`),
      createEmptyCell(`rhsStringField3${index}`)
    ];
  };

  const createFilterUI = (filter, index, handleChange, min, max, step) => {
    const typeKey = Filter.typeKey(filter);

    let answer;

    switch (typeKey) {
      case FilterType.BOOLEAN:
        answer = createBooleanFilterUI(index);
        break;
      case FilterType.NUMBER:
        answer = createNumberFilterUI(filter, index, handleChange, min, max, step);
        break;
      case FilterType.STRING:
        answer = createStringFilterUI(filter, index, handleChange);
        break;
      default:
        throw new Error(`Unknown filter typeKey: ${typeKey}`);
    }

    return answer;
  };

  const createRemoveButton = (isRemoveHidden, handleOnClick) =>
    ReactDOMFactories.button({ hidden: isRemoveHidden, onClick: handleOnClick }, "-");

  const operatorKeyFromDocument = (column, index) => {
    const element = document.getElementById(`operatorSelect${index}`);
    const operatorKey = element.value;
    const operators = operatorsFor(column);
    const operatorKeys = R.map(op => op.key, operators);

    return operatorKeys.includes(operatorKey) ? operatorKey : operators[0].key;
  };

  const rhsFromDocument = index => {
    const element = document.getElementById(`rhsField${index}`);

    return element ? element.value : undefined;
  };

  const rhs2FromDocument = index => {
    const element = document.getElementById(`rhs2Field${index}`);

    return element ? element.value : undefined;
  };

  class FilterRow extends React.PureComponent {
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
      const column = columnFromDocument(tableColumns, index);
      const operatorKey = operatorKeyFromDocument(column, index);
      const rhs = rhsFromDocument(index);
      const rhs2 = rhs2FromDocument(index);

      let newFilter;

      switch (column.type) {
        case FilterType.BOOLEAN:
          newFilter = Filter.create({ columnKey: column.key, operatorKey });
          break;
        case FilterType.NUMBER:
          newFilter = Filter.create({
            columnKey: column.key,
            operatorKey,
            rhs: asNumber(rhs),
            rhs2: asNumber(rhs2)
          });
          break;
        case FilterType.STRING:
        case undefined:
          newFilter = Filter.create({ columnKey: column.key, operatorKey, rhs });
          break;
        default:
          throw new Error(`Unknown column.type: ${column.type}`);
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
      const filterUI = createFilterUI(
        filter,
        index,
        this.handleChange,
        column.min,
        column.max,
        column.step
      );
      const removeButton = ReactUtilities.createCell(
        createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
        `removeButtonCell${index}`
      );
      const addButton = ReactUtilities.createCell(
        createAddButton(this.handleAddOnClick),
        `addButtonCell${index}`
      );

      const cells = [columnSelect, operatorSelect, filterUI, removeButton, addButton];

      return ReactUtilities.createRow(cells, `${column.key}FilterRow${index}`, "frt-filter-row");
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

  class FilterUI extends React.PureComponent {
    constructor(props) {
      super(props);

      this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
      this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
    }

    createButtonTable() {
      const { applyOnClick, removeOnClick } = this.props;

      const unfilterButton = ReactDOMFactories.button({ onClick: removeOnClick }, "Remove");
      const filterButton = ReactDOMFactories.button({ onClick: applyOnClick }, "Apply");

      const cells = [
        ReactUtilities.createCell(unfilterButton, "unfilterButton", "button"),
        ReactUtilities.createCell(filterButton, "filterButton", "button")
      ];
      const row = ReactUtilities.createRow(cells, "button-row");

      return ReactUtilities.createTable(row, "buttonTable", "buttons");
    }

    createTable() {
      const rows = [];

      const { filters, tableColumns } = this.props;
      const { handleAddOnClick, handleChange, handleRemoveOnClick } = this;
      const filters2 = R.concat([], filters);

      if (filters2.length === 0) {
        const firstColumn = tableColumns[0];
        let newFilter;

        switch (firstColumn.type) {
          case FilterType.BOOLEAN:
            newFilter = Filter.create({
              columnKey: firstColumn.key,
              operatorKey: Object.keys(BooleanFilterOperator.properties)[0]
            });
            break;
          case FilterType.NUMBER:
            newFilter = Filter.create({
              columnKey: firstColumn.key,
              operatorKey: Object.keys(NumberFilterOperator.properties)[0],
              rhs: 0
            });
            break;
          case FilterType.STRING:
          case undefined:
            newFilter = Filter.create({
              columnKey: firstColumn.key,
              operatorKey: Object.keys(StringFilterOperator.properties)[0],
              rhs: ""
            });
            break;
          default:
            throw new Error(`Unknown firstColumn.type: ${firstColumn.type}`);
        }

        filters2.push(newFilter);
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
          removeOnClick: handleRemoveOnClick
        });
        rows.push(row);
      }

      return ReactUtilities.createTable(rows, "filterTable");
    }

    handleAddOnClickFunction(index) {
      const { filters, onChange, tableColumns } = this.props;
      const firstColumn = tableColumns[0];
      let newFilter;

      switch (firstColumn.type) {
        case FilterType.BOOLEAN:
          newFilter = Filter.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(BooleanFilterOperator.properties)[0]
          });
          break;
        case FilterType.NUMBER:
          newFilter = Filter.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(NumberFilterOperator.properties)[0],
            rhs: 0
          });
          break;
        case FilterType.STRING:
        case undefined:
          newFilter = Filter.create({
            columnKey: firstColumn.key,
            operatorKey: Object.keys(StringFilterOperator.properties)[0],
            rhs: ""
          });
          break;
        default:
          throw new Error(`Unknown firstColumn.type: ${firstColumn.type}`);
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
      const filterTable = ReactUtilities.createCell(this.createTable(), "filterTable", "inner-table");
      const rows0 = ReactUtilities.createRow(filterTable, "filterTableCells");
      const table0 = ReactUtilities.createTable(rows0, "filterTableRow");
      const cell0 = ReactUtilities.createCell(table0, "filterTable");
      const cell1 = ReactUtilities.createCell(this.createButtonTable(), "buttonTable", "button-panel");

      const rows = [
        ReactUtilities.createRow(cell0, "filterTablesRow"),
        ReactUtilities.createRow(cell1, "buttonRow")
      ];

      return ReactUtilities.createTable(rows, "filterTable", "frt-filter");
    }
  }

  FilterUI.propTypes = {
    filters: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onChange: PropTypes.func.isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

    applyOnClick: PropTypes.func.isRequired,
    removeOnClick: PropTypes.func.isRequired
  };

  const mapStateToProps$1 = state => {
    const { filters, tableColumns } = state;
    const myTableColumns = R.filter(c => c.type !== "none", tableColumns);

    return {
      filters,
      tableColumns: myTableColumns
    };
  };

  const mapDispatchToProps = (dispatch /* , ownProps */) => ({
    applyOnClick: () => {
      dispatch(ActionCreator.applyFilters());
    },
    onChange: filters => {
      dispatch(ActionCreator.setFilters(filters));
    },
    removeOnClick: () => {
      dispatch(ActionCreator.removeFilters());
    }
  });

  var FilterContainer = ReactRedux.connect(
    mapStateToProps$1,
    mapDispatchToProps
  )(FilterUI);

  class ColumnCheckbox extends React.PureComponent {
    constructor(props) {
      super(props);

      this.handleChange = this.handleChangeFunction.bind(this);
    }

    handleChangeFunction(event) {
      const { column, onChange } = this.props;
      const { checked } = event.target;

      onChange(column.key, checked);
    }

    render() {
      const { column, isChecked } = this.props;

      const input = ReactDOMFactories.input({
        key: `${column.key}${isChecked}`,
        type: "checkbox",
        checked: isChecked,
        onChange: this.handleChange,
        style: { verticalAlign: "middle" }
      });
      const labelElement = ReactDOMFactories.span(
        { style: { verticalAlign: "middle" } },
        column.label
      );

      return ReactDOMFactories.label(
        { style: { display: "block", verticalAlign: "middle" } },
        input,
        labelElement
      );
    }
  }

  ColumnCheckbox.propTypes = {
    column: PropTypes.shape().isRequired,
    onChange: PropTypes.func.isRequired,

    isChecked: PropTypes.bool
  };

  ColumnCheckbox.defaultProps = {
    isChecked: false
  };

  class ShowColumnsUI extends React.PureComponent {
    constructor(props) {
      super(props);

      const { columnToChecked } = this.props;
      this.state = { columnToChecked };
      this.handleApply = this.handleApplyFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
    }

    createButtonTable() {
      const applyButton = ReactDOMFactories.button({ onClick: this.handleApply }, "Apply");
      const cell = ReactUtilities.createCell(applyButton, "applyButton", "button");
      const row = ReactUtilities.createRow(cell, "button-row");

      return ReactUtilities.createTable(row, "buttonTable", "buttons");
    }

    handleApplyFunction() {
      const { applyOnClick } = this.props;
      const { columnToChecked } = this.state;

      applyOnClick(columnToChecked);
    }

    handleChangeFunction(columnKey, isChecked) {
      const { columnToChecked } = this.state;
      const newColumnToChecked = R.assoc(columnKey, isChecked, columnToChecked);

      this.setState({ columnToChecked: newColumnToChecked });
    }

    render() {
      const { tableColumns } = this.props;
      const { columnToChecked } = this.state;

      const mapFunction = column => {
        const isChecked = columnToChecked[column.key];
        const checkbox = React.createElement(ColumnCheckbox, {
          column,
          isChecked,
          onChange: this.handleChange
        });
        const cell = ReactUtilities.createCell(checkbox);
        return ReactUtilities.createRow(cell, column.key);
      };
      const checkboxes = R.map(mapFunction, tableColumns);

      const cell0 = ReactUtilities.createTable(checkboxes, "checkboxTable", "checkbox-panel");
      const cell1 = ReactUtilities.createCell(this.createButtonTable(), "buttonTable", "button-panel");

      const rows = [
        ReactUtilities.createRow(cell0, "checkboxTableRow"),
        ReactUtilities.createRow(cell1, "buttonRow")
      ];

      return ReactUtilities.createTable(rows, "showColumnsTable", "frt-show-columns");
    }
  }

  ShowColumnsUI.propTypes = {
    columnToChecked: PropTypes.shape().isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    applyOnClick: PropTypes.func.isRequired
  };

  const mapStateToProps$2 = state => {
    const { columnToChecked, tableColumns } = state;

    return {
      columnToChecked,
      tableColumns
    };
  };

  const mapDispatchToProps$1 = dispatch => ({
    applyOnClick: columnToChecked => {
      dispatch(ActionCreator.applyShowColumns(columnToChecked));
    }
  });

  var ShowColumnsContainer = ReactRedux.connect(
    mapStateToProps$2,
    mapDispatchToProps$1
  )(ShowColumnsUI);

  const convert = tableColumns => tableRows => {
    const mapFunction = row => {
      const reduceFunction = (accum, column) => {
        const value = column.convertFunction ? column.convertFunction(row) : row[column.key];

        return R.assoc(column.key, value, accum);
      };

      return R.reduce(reduceFunction, {}, tableColumns);
    };

    return R.map(mapFunction, tableRows);
  };

  const defaultColumnToChecked = tableColumns => {
    const reduceFunction = (accum, column) => {
      const isChecked = column.isShown !== undefined ? column.isShown : true;
      return R.assoc(column.key, isChecked, accum);
    };

    return R.reduce(reduceFunction, {}, tableColumns);
  };

  const determineCell = tableColumns => tableRows => {
    const mapFunction = row => {
      const reduceFunction = (accum, column) => {
        if (column.cellFunction) {
          const cell = column.cellFunction(row);

          return R.assoc(`frt-cell-${column.key}`, cell, accum);
        }
        return accum;
      };

      return R.reduce(reduceFunction, row, tableColumns);
    };

    return R.map(mapFunction, tableRows);
  };

  const determineValue$1 = tableColumns => tableRows => {
    const mapFunction = row => {
      const reduceFunction = (accum, column) => {
        if (column.valueFunction) {
          const value = column.valueFunction(row);

          return R.assoc(`frt-value-${column.key}`, value, accum);
        }
        return accum;
      };

      return R.reduce(reduceFunction, row, tableColumns);
    };

    return R.map(mapFunction, tableRows);
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
    constructor(tableColumns, tableRows, appName, onFilterChange, onShowColumnChange, isVerbose) {
      verifyParameter("tableColumns", tableColumns);
      verifyParameter("tableRows", tableRows);

      let columnToChecked = Preferences.getColumnToChecked(appName);

      if (Object.keys(columnToChecked).length === 0) {
        columnToChecked = defaultColumnToChecked(tableColumns);
      }

      const tableRows2 = R.pipe(
        convert(tableColumns),
        determineValue$1(tableColumns),
        determineCell(tableColumns)
      )(tableRows);

      this.store = Redux.createStore(Reducer.root);

      this.store.dispatch(ActionCreator.setTableColumns(tableColumns));
      this.store.dispatch(ActionCreator.applyShowColumns(columnToChecked));
      this.store.dispatch(ActionCreator.setTableRows(tableRows2));
      this.store.dispatch(ActionCreator.setAppName(appName));
      this.store.dispatch(ActionCreator.setVerbose(isVerbose));

      const filters = Preferences.getFilters(appName);
      this.store.dispatch(ActionCreator.setFilters(filters));

      if (onFilterChange) {
        const select = state => state.filteredTableRows;
        Observer.observeStore(this.store, select, onFilterChange);
      }

      if (onShowColumnChange) {
        const select = state => state.columnToChecked;
        Observer.observeStore(this.store, select, onShowColumnChange);
      }
    }

    filteredTableRows() {
      return Selector.filteredTableRows(this.store.getState());
    }

    filterElement() {
      const container = React.createElement(FilterContainer);

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTFilterProvider", store: this.store },
        container
      );
    }

    filterPanel(title = "Filters") {
      const filter = this.filterElement();

      return React.createElement(CollapsiblePanel, { title, child: filter });
    }

    showColumnsElement() {
      const container = React.createElement(ShowColumnsContainer);

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTShowColumnsProvider", store: this.store },
        container
      );
    }

    showColumnsPanel(title = "Columns") {
      const showColumns = this.showColumnsElement();

      return React.createElement(CollapsiblePanel, { title, child: showColumns });
    }

    tableElement() {
      const container = React.createElement(DataTableContainer);

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTTableProvider", store: this.store },
        container
      );
    }
  }

  return FilteredReactTable;

}));
