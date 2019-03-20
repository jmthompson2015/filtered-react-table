import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";

const Filter = {};

const operator = opKey => NFO.properties[opKey] || SFO.properties[opKey];

const compareFunction = opKey => operator(opKey).compareFunction;

Filter.create = ({ columnKey, operatorKey, rhs, rhs2 }) =>
  Immutable({
    columnKey,
    operatorKey,
    rhs,
    rhs2
  });

Filter.isNumberFilter = filter =>
  filter !== undefined && Object.keys(NFO.properties).includes(filter.operatorKey);

Filter.isStringFilter = filter =>
  filter !== undefined && Object.keys(SFO.properties).includes(filter.operatorKey);

Filter.passes = (filter, data) => {
  const value = data[filter.columnKey];

  return value === undefined
    ? true
    : compareFunction(filter.operatorKey)(value, filter.rhs, filter.rhs2);
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
  const rhs = Filter.isStringFilter(filter) ? `"${filter.rhs}"` : `${filter.rhs}`;
  const rhs2 = filter.rhs2 ? ` ${filter.rhs}` : "";

  return `Filter (${filter.columnKey} ${operator(filter.operatorKey).label} ${rhs}${rhs2})`;
};

Object.freeze(Filter);

export default Filter;
