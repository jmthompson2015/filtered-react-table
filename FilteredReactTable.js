import ActionCreator from "./state/ActionCreator.js";
import Observer from "./state/Observer.js";
import Preferences from "./state/Preferences.js";
import Reducer from "./state/Reducer.js";
import Selector from "./state/Selector.js";

import CollapsiblePanel from "./view/CollapsiblePanel.js";

import DataTableContainer from "./container/DataTableContainer.js";
import FilterContainer from "./container/FilterContainer.js";
import ShowColumnsContainer from "./container/ShowColumnsContainer.js";

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

const determineValue = tableColumns => tableRows => {
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
      determineValue(tableColumns),
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

export default FilteredReactTable;
