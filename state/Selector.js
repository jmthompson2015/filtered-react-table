const Selector = {};

Selector.filteredTableRows = state => state.filteredTableRows;

Selector.filters = state => state.filters;

Selector.tableColumns = state => state.tableColumns;

Selector.tableRows = state => state.tableRows;

Object.freeze(Selector);

export default Selector;
