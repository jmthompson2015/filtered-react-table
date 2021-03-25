import BFO from "./BooleanFilterOperator.js";
import FilterClauseType from "./FilterClauseType.js";
import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";
import TCU from "./TableColumnUtilities.js";

const FilterClause = {};

const operator = (operatorKey) =>
  BFO.properties[operatorKey] ||
  NFO.properties[operatorKey] ||
  SFO.properties[operatorKey];

const compareFunction = (operatorKey) => operator(operatorKey).compareFunction;

FilterClause.create = ({ columnKey, operatorKey, rhs, rhs2 }) =>
  Immutable({
    columnKey,
    operatorKey,
    rhs,
    rhs2,
  });

FilterClause.isBooleanFilterClause = (filterClause) =>
  filterClause !== undefined &&
  Object.keys(BFO.properties).includes(filterClause.operatorKey);

FilterClause.isNumberFilterClause = (filterClause) =>
  filterClause !== undefined &&
  Object.keys(NFO.properties).includes(filterClause.operatorKey);

FilterClause.isStringFilterClause = (filterClause) =>
  filterClause !== undefined &&
  Object.keys(SFO.properties).includes(filterClause.operatorKey);

FilterClause.passes = (tableColumns, filterClause, row) => {
  const column = TCU.tableColumn(tableColumns, filterClause.columnKey);
  if (column === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      `Unknown column for filterClause.columnKey: ${filterClause.columnKey}`
    );
  }

  if (column !== undefined) {
    const value = TCU.determineValue(column, row);
    const compare = compareFunction(filterClause.operatorKey);

    return compare(value, filterClause.rhs, filterClause.rhs2);
  }
  return false;
};

FilterClause.passesAll = (tableColumns, filters, row) => {
  let answer = true;
  const propertyNames = Object.keys(filters);

  for (let i = 0; i < propertyNames.length; i += 1) {
    const propertyName = propertyNames[i];
    const filter = filters[propertyName];
    const passes = FilterClause.passes(tableColumns, filter, row);

    if (!passes) {
      answer = false;
      break;
    }
  }

  return answer;
};

FilterClause.toString = (filter) => {
  const operatorLabel = operator(filter.operatorKey).label;

  if (FilterClause.isBooleanFilterClause(filter)) {
    return `FilterClause (${filter.columnKey} ${operatorLabel})`;
  }

  if (FilterClause.isStringFilterClause(filter)) {
    return `FilterClause (${filter.columnKey} ${operatorLabel} "${filter.rhs}")`;
  }

  const rhs2 = filter.rhs2 ? ` ${filter.rhs}` : "";
  return `FilterClause (${filter.columnKey} ${operatorLabel} ${filter.rhs}${rhs2})`;
};

FilterClause.typeKey = (filter) => {
  let answer;

  if (FilterClause.isBooleanFilterClause(filter)) {
    answer = FilterClauseType.BOOLEAN;
  } else if (FilterClause.isNumberFilterClause(filter)) {
    answer = FilterClauseType.NUMBER;
  } else if (FilterClause.isStringFilterClause(filter)) {
    answer = FilterClauseType.STRING;
  }

  return answer;
};

Object.freeze(FilterClause);

export default FilterClause;
