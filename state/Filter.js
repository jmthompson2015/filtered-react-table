import BFO from "./BooleanFilterOperator.js";
import FilterType from "./FilterType.js";
import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";

const Filter = {};

const operator = opKey => BFO.properties[opKey] || NFO.properties[opKey] || SFO.properties[opKey];

const compareFunction = opKey => operator(opKey).compareFunction;

Filter.create = ({ columnKey, operatorKey, rhs, rhs2 }) => ({
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

Filter.passes = (filter, data) => {
  const value = data[filter.columnKey];
  const compare = compareFunction(filter.operatorKey);

  return compare(value, filter.rhs, filter.rhs2);
};

Filter.passesAll = (filters, data) => {
  let answer = true;
  const propertyNames = Object.keys(filters);

  for (let i = 0; i < propertyNames.length; i += 1) {
    const propertyName = propertyNames[i];
    const filter = filters[propertyName];
    const passes = Filter.passes(filter, data);

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
