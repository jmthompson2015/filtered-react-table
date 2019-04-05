import BFO from "./BooleanFilterOperator.js";
import FilterType from "./FilterType.js";
import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";
import TCU from "./TableColumnUtilities.js";

const Filter = {};

const operator = operatorKey =>
  BFO.properties[operatorKey] || NFO.properties[operatorKey] || SFO.properties[operatorKey];

const compareFunction = operatorKey => operator(operatorKey).compareFunction;

Filter.create = ({ columnKey, operatorKey, rhs, rhs2 }) =>
  Immutable({
    columnKey,
    operatorKey,
    rhs,
    rhs2
  });

Filter.isBooleanFilter = filter =>
  filter !== undefined && Object.keys(BFO.properties).includes(filter.operatorKey);

Filter.isNumberFilter = filter =>
  filter !== undefined && Object.keys(NFO.properties).includes(filter.operatorKey);

Filter.isStringFilter = filter =>
  filter !== undefined && Object.keys(SFO.properties).includes(filter.operatorKey);

Filter.passes = (tableColumns, filter, row) => {
  const column = TCU.tableColumn(tableColumns, filter.columnKey);
  if (column === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`Unknown column for filter.columnKey: ${filter.columnKey}`);
  }

  if (column !== undefined) {
    const value = TCU.determineValue(column, row);
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

export default Filter;
