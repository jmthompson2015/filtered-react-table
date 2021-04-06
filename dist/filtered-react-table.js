(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FilteredReactTable = factory());
}(this, (function () { 'use strict';

  const ActionType = {};

  ActionType.APPLY_FILTERS = "applyFilters";
  ActionType.APPLY_SHOW_COLUMNS = "applyShowColumns";
  ActionType.REMOVE_FILTERS = "removeFilters";
  ActionType.SET_APP_NAME = "setAppName";
  ActionType.SET_FILTER_GROUP = "setFilterGroup";
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

  ActionCreator.setAppName = makeActionCreator(
    ActionType.SET_APP_NAME,
    "appName"
  );

  ActionCreator.setFilterGroup = makeActionCreator(
    ActionType.SET_FILTER_GROUP,
    "filterGroup"
  );

  ActionCreator.setTableColumns = makeActionCreator(
    ActionType.SET_TABLE_COLUMNS,
    "tableColumns"
  );

  ActionCreator.setTableRows = makeActionCreator(
    ActionType.SET_TABLE_ROWS,
    "tableRows"
  );

  ActionCreator.setVerbose = makeActionCreator(
    ActionType.SET_VERBOSE,
    "isVerbose"
  );

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

  const fetchItem = (appName) => {
    const oldItemString = localStorage.getItem(appName);

    return oldItemString !== undefined ? JSON.parse(oldItemString) : {};
  };

  Preferences.getColumnToChecked = (appName) => {
    const item = fetchItem(appName);

    return item && item.columnToChecked
      ? Immutable(item.columnToChecked)
      : Immutable({});
  };

  Preferences.setColumnToChecked = (appName, columnToChecked) => {
    const oldItem = fetchItem(appName);
    const newItem = R.merge(oldItem, { columnToChecked });

    localStorage.setItem(appName, JSON.stringify(newItem));
  };

  Preferences.getFilterGroup = (appName) => {
    const item = fetchItem(appName);

    return item && item.filterGroup ? Immutable(item.filterGroup) : Immutable([]);
  };

  Preferences.setFilterGroup = (appName, filterGroup) => {
    const oldItem = fetchItem(appName);
    const newItem = R.merge(oldItem, { filterGroup });

    localStorage.setItem(appName, JSON.stringify(newItem));
  };

  Object.freeze(Preferences);

  const AppState = {};

  AppState.create = ({
    appName = "FilteredReactTable",
    columnToChecked = {},
    filteredTableRows = [],
    filterGroup = undefined,
    isVerbose = false,
    tableColumns = [],
    tableRows = [],
  } = {}) =>
    Immutable({
      appName,
      columnToChecked,
      filteredTableRows,
      filterGroup,
      isVerbose,
      tableColumns,
      tableRows,
    });

  Object.freeze(AppState);

  /* eslint no-console: ["error", { allow: ["log", "warn"] }] */

  const { Filter, FilterGroup: FilterGroup$1 } = FilterJS;

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
          state.tableRows,
          state.filterGroup
        );
        return R.assoc("filteredTableRows", newFilteredTableRows, state);
      case ActionType.APPLY_SHOW_COLUMNS:
        if (state.isVerbose) {
          console.log(
            `Reducer APPLY_SHOW_COLUMNS columnToChecked = ${JSON.stringify(
            action.columnToChecked
          )}`
          );
        }
        Preferences.setColumnToChecked(
          state.appName,
          Immutable(action.columnToChecked)
        );
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
      case ActionType.SET_FILTER_GROUP:
        if (state.isVerbose) {
          console.log(
            `Reducer SET_FILTER_GROUP filterGroup = ${JSON.stringify(
            action.filterGroup
          )}`
          );
        }
        Preferences.setFilterGroup(state.appName, Immutable(action.filterGroup));
        return R.assoc("filterGroup", action.filterGroup, state);
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

  Reducer.filterTableRows = (tableRows, filterGroup) => {
    const filter = FilterGroup$1.selectedFilter(filterGroup);
    const filterFunction = (data) => Filter.passes(filter, data);

    return Immutable(R.filter(filterFunction, tableRows));
  };

  Object.freeze(Reducer);

  const Selector = {};

  Selector.filteredTableRows = (state) => state.filteredTableRows;

  Selector.filterGroup = (state) => state.filterGroup;

  Selector.tableColumns = (state) => state.tableColumns;

  Selector.tableRows = (state) => state.tableRows;

  Object.freeze(Selector);

  const ColumnUtilities = {};

  ColumnUtilities.createColorCell = (color, name) =>
    ReactDOMFactories.div({ style: { backgroundColor: color } }, name);

  ColumnUtilities.createIcon = (iconUrl, name, width = 32) =>
    ReactDOMFactories.img({
      key: iconUrl,
      src: iconUrl,
      style: { width },
      title: name,
    });

  ColumnUtilities.createImageLink = (src, href, title) => {
    const image = ReactDOMFactories.img({ src });

    return ReactDOMFactories.a(
      { key: src, href, title, target: "_blank" },
      image
    );
  };

  ColumnUtilities.createLink = (href, name) =>
    ReactDOMFactories.a({ key: name, href, target: "_blank" }, name);

  ColumnUtilities.createSpan = (label, fontColor = "red") =>
    ReactDOMFactories.span({ key: label, style: { color: fontColor } }, label);

  ColumnUtilities.US_FORMATTER0 = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  ColumnUtilities.US_FORMATTER2 = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  ColumnUtilities.formatNumber = (
    value,
    formatter = ColumnUtilities.US_FORMATTER0
  ) => (R.isNil(value) ? undefined : formatter.format(value));

  ColumnUtilities.parseFloat = (value) =>
    !R.isNil(value) && typeof value === "string" ? parseFloat(value) : value;

  ColumnUtilities.parseInt = (value) =>
    !R.isNil(value) && typeof value === "string" ? parseInt(value, 10) : value;

  Object.freeze(ColumnUtilities);

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

  const { ClauseType } = FilterJS;
  const { ReactUtilities: RU$1 } = ReactComponent;

  const determineValue$1 = (column, row) => {
    if (column.type === ClauseType.BOOLEAN) {
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
      const { tableColumns } = this.props;
      const mapFunction = (column) => {
        const value = determineValue$1(column, data);
        const cell = TableColumnUtilities.determineCell(column, data);
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

      return React.createElement(Reactable.Tr, { key }, cells);
    }

    createTable(rowData) {
      const { columnToChecked, tableColumns } = this.props;

      const myTableColumns = filterTableColumns(columnToChecked, tableColumns);
      const mapFunction = (data) => this.createRow(data, data.id || data.name);
      const rows = R.map(mapFunction, rowData);

      return React.createElement(
        Reactable.Table,
        { className: "frt-table", columns: myTableColumns, sortable: true },
        rows
      );
    }

    render() {
      const { rowData } = this.props;

      const rowCount = `Row Count: ${rowData.length}`;
      const table = this.createTable(rowData);

      const rows = [
        RU$1.createRow(RU$1.createCell(rowCount, "top", "frt-rowCount"), "topRow"),
        RU$1.createRow(RU$1.createCell(table), "tableRow"),
        RU$1.createRow(
          RU$1.createCell(rowCount, "bottom", "frt-rowCount"),
          "bottomRow"
        ),
      ];

      return RU$1.createTable(rows);
    }
  }

  DataTable.propTypes = {
    columnToChecked: PropTypes.shape().isRequired,
    rowData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  };

  const mapStateToProps$2 = state => ({
    columnToChecked: state.columnToChecked,
    rowData: state.filteredTableRows,
    tableColumns: state.tableColumns
  });

  var DataTableContainer = ReactRedux.connect(mapStateToProps$2)(DataTable);

  const { FilterGroup, FilterGroupUI } = FilterJS;

  const mapStateToProps$1 = (state) => {
    const { filterGroup, tableColumns } = state;
    let myFilterGroup;

    if (filterGroup && !Array.isArray(filterGroup)) {
      myFilterGroup = filterGroup;
    } else {
      myFilterGroup = FilterGroup.default(tableColumns);
    }

    const filterFunction = (c) => c.type !== "none";
    const myTableColumns = R.filter(filterFunction, tableColumns);

    return {
      initialFilterGroup: myFilterGroup,
      tableColumns: myTableColumns,
    };
  };

  const mapDispatchToProps$1 = (dispatch) => ({
    applyOnClick: () => {
      dispatch(ActionCreator.applyFilters());
    },
    onChange: (filterGroup) => {
      dispatch(ActionCreator.setFilterGroup(filterGroup));
    },
    removeOnClick: () => {
      dispatch(ActionCreator.removeFilters());
    },
  });

  var FilterContainer = ReactRedux.connect(
    mapStateToProps$1,
    mapDispatchToProps$1
  )(FilterGroupUI);

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

  const { ReactUtilities: RU } = ReactComponent;

  class ShowColumnsUI extends React.PureComponent {
    constructor(props) {
      super(props);

      const { columnToChecked } = this.props;
      this.state = { columnToChecked };
      this.handleApply = this.handleApplyFunction.bind(this);
      this.handleChange = this.handleChangeFunction.bind(this);
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

    createButtonTable() {
      const applyButton = ReactDOMFactories.button(
        { onClick: this.handleApply },
        "Apply"
      );
      const cell = RU.createCell(applyButton, "applyButton", "button");
      const row = RU.createRow(cell, "button-row");

      return RU.createTable(row, "buttonTable", "buttons");
    }

    render() {
      const { tableColumns } = this.props;
      const { columnToChecked } = this.state;

      const mapFunction = (column) => {
        const isChecked = columnToChecked[column.key];
        const checkbox = React.createElement(ColumnCheckbox, {
          column,
          isChecked,
          onChange: this.handleChange,
        });
        const cell = RU.createCell(checkbox);
        return RU.createRow(cell, column.key);
      };
      const checkboxes = R.map(mapFunction, tableColumns);

      const cell0 = RU.createTable(checkboxes, "checkboxTable", "checkbox-panel");
      const cell1 = RU.createCell(
        this.createButtonTable(),
        "buttonTable",
        "button-panel"
      );

      const rows = [
        RU.createRow(cell0, "checkboxTableRow"),
        RU.createRow(cell1, "buttonRow"),
      ];

      return RU.createTable(rows, "showColumnsTable", "frt-show-columns");
    }
  }

  ShowColumnsUI.propTypes = {
    columnToChecked: PropTypes.shape().isRequired,
    tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    applyOnClick: PropTypes.func.isRequired,
  };

  const mapStateToProps = state => {
    const { columnToChecked, tableColumns } = state;

    return {
      columnToChecked,
      tableColumns
    };
  };

  const mapDispatchToProps = dispatch => ({
    applyOnClick: columnToChecked => {
      dispatch(ActionCreator.applyShowColumns(columnToChecked));
    }
  });

  var ShowColumnsContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
  )(ShowColumnsUI);

  const { CollapsiblePane } = ReactComponent;

  const convert = (tableColumns) => (tableRows) => {
    const reduceFunction1 = (accum, column) => R.assoc(column.key, column, accum);
    const columnMap = R.reduce(reduceFunction1, {}, tableColumns);

    const mapFunction = (row) => {
      const reduceFunction2 = (accum, key) => {
        let newValue = row[key];
        const column = columnMap[key];

        if (column && column.convertFunction) {
          newValue = column.convertFunction(row);
        }

        return R.assoc(key, newValue, accum);
      };
      const keys = Object.keys(row);

      return R.reduce(reduceFunction2, {}, keys);
    };

    return R.map(mapFunction, tableRows);
  };

  const defaultColumnToChecked = (tableColumns) => {
    const reduceFunction = (accum, column) => {
      const isChecked = column.isShown !== undefined ? column.isShown : true;
      return R.assoc(column.key, isChecked, accum);
    };

    return R.reduce(reduceFunction, {}, tableColumns);
  };

  const determineCell = (tableColumns) => (tableRows) => {
    const mapFunction = (row) => {
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

  const determineValue = (tableColumns) => (tableRows) => {
    const mapFunction = (row) => {
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
    constructor(
      tableColumns,
      tableRows,
      appName,
      onFilterChange,
      onShowColumnChange,
      isVerbose
    ) {
      verifyParameter("tableColumns", tableColumns);
      verifyParameter("tableRows", tableRows);

      let columnToChecked = Preferences.getColumnToChecked(appName);

      if (Object.keys(columnToChecked).length === 0) {
        columnToChecked = defaultColumnToChecked(tableColumns);
      }

      const tableRows2 = R.pipe(
        convert(tableColumns),
        determineValue(tableColumns),
        determineCell(tableColumns)
      )(tableRows);

      this.store = Redux.createStore(Reducer.root);

      this.store.dispatch(ActionCreator.setTableColumns(tableColumns));
      this.store.dispatch(ActionCreator.applyShowColumns(columnToChecked));
      this.store.dispatch(ActionCreator.setTableRows(tableRows2));
      this.store.dispatch(ActionCreator.setAppName(appName));
      this.store.dispatch(ActionCreator.setVerbose(isVerbose));

      const filterGroup = Preferences.getFilterGroup(appName);
      this.store.dispatch(ActionCreator.setFilterGroup(filterGroup));

      if (onFilterChange) {
        const select = (state) => state.filteredTableRows;
        Observer.observeStore(this.store, select, onFilterChange);
      }

      if (onShowColumnChange) {
        const select = (state) => state.columnToChecked;
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

    filterPanel(
      header = "Filters",
      className = "bg-light-gray ma1",
      headerClass = "b f5 ph1 pt1 tc"
    ) {
      const filter = this.filterElement();

      return React.createElement(CollapsiblePane, {
        className,
        header,
        element: filter,
        headerClass,
        isExpanded: false,
      });
    }

    showColumnsElement() {
      const container = React.createElement(ShowColumnsContainer);

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTShowColumnsProvider", store: this.store },
        container
      );
    }

    showColumnsPanel(
      header = "Columns",
      className = "bg-light-gray ma1",
      headerClass = "b f5 ph1 pt1 tc"
    ) {
      const showColumns = this.showColumnsElement();

      return React.createElement(CollapsiblePane, {
        className,
        header,
        element: showColumns,
        headerClass,
        isExpanded: false,
      });
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

  FilteredReactTable.ColumnUtilities = ColumnUtilities;

  return FilteredReactTable;

})));
