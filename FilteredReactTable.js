import ActionCreator from "./state/ActionCreator.js";
import Reducer from "./state/Reducer.js";
import Selector from "./state/Selector.js";

import DataTableContainer from "./container/DataTableContainer.js";
import FilterContainer from "./container/FilterContainer.js";

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
