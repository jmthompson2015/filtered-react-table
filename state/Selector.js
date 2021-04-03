const Selector = {};

Selector.filteredTableRows = (state) => state.filteredTableRows;

Selector.filterGroup = (state) => state.filterGroup;

Selector.tableColumns = (state) => state.tableColumns;

Selector.tableRows = (state) => state.tableRows;

Object.freeze(Selector);

export default Selector;
