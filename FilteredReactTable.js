import ActionCreator from "./state/ActionCreator.js";
import Reducer from "./state/Reducer.js";

import DataTableContainer from "./container/DataTableContainer.js";
import FilterContainer from "./container/FilterContainer.js";

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

    this.store = Redux.createStore(Reducer.root);

    this.store.dispatch(ActionCreator.setTableColumns(tableColumns));
    this.store.dispatch(ActionCreator.setTableRows(tableRows));
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

export default FilteredReactTable;
