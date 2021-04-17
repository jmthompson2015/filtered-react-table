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
  ActionType.SET_DEFAULT_SORT = "setDefaultSort";
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

  ActionCreator.setDefaultSort = makeActionCreator(
    ActionType.SET_DEFAULT_SORT,
    "defaultSort"
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
    defaultSort = undefined,
    filteredTableRows = [],
    filterGroup = undefined,
    isVerbose = false,
    tableColumns = [],
    tableRows = [],
  } = {}) =>
    Immutable({
      appName,
      columnToChecked,
      defaultSort,
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
      case ActionType.SET_DEFAULT_SORT:
        if (state.isVerbose) {
          console.log(
            `Reducer SET_DEFAULT_SORT defaultSort = ${JSON.stringify(
            action.defaultSort
          )}`
          );
        }
        return R.assoc("defaultSort", action.defaultSort, state);
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

  ColumnUtilities.createIcon = (src, title, width = "auto", maxWidth = "none") =>
    ReactDOMFactories.img({
      key: src,
      src,
      style: { maxWidth, width },
      title,
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
  const { ReactUtilities: RU } = ReactComponent;

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
      const { rowClass, tableColumns } = this.props;
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

      return React.createElement(
        Reactable.Tr,
        { key, className: rowClass },
        cells
      );
    }

    createTable(rowData) {
      const {
        columnToChecked,
        dataTableClass,
        defaultSort,
        tableColumns,
      } = this.props;

      const myTableColumns = filterTableColumns(columnToChecked, tableColumns);
      const mapFunction = (data) => this.createRow(data, data.id || data.name);
      const rows = R.map(mapFunction, rowData);

      return React.createElement(
        Reactable.Table,
        {
          className: `frt-table ${dataTableClass}`,
          columns: myTableColumns,
          defaultSort,
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
    defaultSort: PropTypes.shape(),
    rowClass: PropTypes.string,
    rowCountClass: PropTypes.string,
  };

  DataTable.defaultProps = {
    className: undefined,
    dataTableClass: "bg-white collapse f6 tc",
    defaultSort: undefined,
    rowClass: "striped--white-smoke",
    rowCountClass: "f6 tl",
  };

  const mapStateToProps$2 = (state, ownProps = {}) =>
    R.mergeRight(
      {
        columnToChecked: state.columnToChecked,
        defaultSort: state.defaultSort,
        rowData: state.filteredTableRows,
        tableColumns: state.tableColumns,
      },
      ownProps
    );

  var DataTableContainer = ReactRedux.connect(mapStateToProps$2)(DataTable);

  const { FilterGroup, FilterGroupUI } = FilterJS;

  const mapStateToProps$1 = (state, ownProps = {}) => {
    const { filterGroup, tableColumns } = state;
    let myFilterGroup;

    if (filterGroup && !Array.isArray(filterGroup)) {
      myFilterGroup = filterGroup;
    } else {
      myFilterGroup = FilterGroup.default(tableColumns);
    }

    const filterFunction = (c) => c.type !== "none";
    const myTableColumns = R.filter(filterFunction, tableColumns);

    return R.mergeRight(
      {
        className: "f7",
        initialFilterGroup: myFilterGroup,
        tableColumns: myTableColumns,
      },
      ownProps
    );
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

  const { CheckboxPanel } = ReactComponent;

  const getColumnMap = (tableColumns) => {
    const reduceFunction = (accum, column) => R.assoc(column.key, column, accum);

    return R.reduce(reduceFunction, {}, tableColumns);
  };

  const getSelectedItems = (columnToChecked) => {
    const reduceFunction = (accum, columnKey) =>
      columnToChecked[columnKey] === true ? R.append(columnKey, accum) : accum;

    return R.reduce(reduceFunction, [], Object.keys(columnToChecked));
  };

  const mapStateToProps = (state, ownProps = {}) => {
    const { columnToChecked, tableColumns } = state;
    const columnMap = getColumnMap(tableColumns);
    const items = R.map(R.prop("key"), tableColumns);
    const selectedItems = getSelectedItems(columnToChecked);
    const labelFunction = (item) => columnMap[item].label;

    return R.mergeRight(
      {
        className: "f7",
        items,
        labelFunction,
        selectedItems,
        useSelectButtons: true,
      },
      ownProps
    );
  };

  const mapDispatchToProps = (dispatch) => ({
    applyOnClick: (selectedItems) => {
      const reduceFunction = (accum, columnKey) =>
        R.assoc(columnKey, true, accum);
      const columnToChecked = R.reduce(reduceFunction, {}, selectedItems);
      dispatch(ActionCreator.applyShowColumns(columnToChecked));
    },
  });

  var ShowColumnsContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxPanel);

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
    constructor({
      tableColumns,
      tableRows,
      defaultSort,
      appName,
      onFilterChange,
      onShowColumnChange,
      isVerbose = false,
    }) {
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
      this.store.dispatch(ActionCreator.setDefaultSort(defaultSort));
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

    filterElement(filterProps) {
      const container = React.createElement(FilterContainer, filterProps);

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTFilterProvider", store: this.store },
        container
      );
    }

    filterPanel(collapsiblePaneProps = {}, filterProps = {}) {
      const props = R.mergeRight(
        {
          title: "Filters",
          element: this.filterElement(filterProps),
        },
        collapsiblePaneProps
      );

      return React.createElement(CollapsiblePane, props);
    }

    showColumnsElement(showColumnsProps) {
      const container = React.createElement(
        ShowColumnsContainer,
        showColumnsProps
      );

      return React.createElement(
        ReactRedux.Provider,
        { key: "FRTShowColumnsProvider", store: this.store },
        container
      );
    }

    showColumnsPanel(collapsiblePaneProps = {}, showColumnsProps = {}) {
      const props = R.mergeRight(
        {
          title: "Columns",
          element: this.showColumnsElement(showColumnsProps),
        },
        collapsiblePaneProps
      );

      return React.createElement(CollapsiblePane, props);
    }

    tableElement(dataTableProps) {
      const container = React.createElement(DataTableContainer, dataTableProps);

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
