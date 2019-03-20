const NumberFilterOperator = {
  IS: "nfoIs",
  IS_NOT: "nfoIsNot",
  IS_GREATER_THAN: "nfoIsGreaterThan",
  IS_LESS_THAN: "nfoIsLessThan",
  IS_IN_THE_RANGE: "nfoIsInTheRange"
};

NumberFilterOperator.properties = {
  nfoIs: {
    label: "is",
    compareFunction: (lhs, rhs) => lhs === rhs,
    key: "nfoIs"
  },
  nfoIsNot: {
    label: "is not",
    compareFunction: (lhs, rhs) => lhs !== rhs,
    key: "nfoIsNot"
  },
  nfoIsGreaterThan: {
    label: "is greater than",
    compareFunction: (lhs, rhs) => lhs > rhs,
    key: "nfoIsGreaterThan"
  },
  nfoIsLessThan: {
    label: "is less than",
    compareFunction: (lhs, rhs) => lhs < rhs,
    key: "nfoIsLessThan"
  },
  nfoIsInTheRange: {
    label: "is in the range",
    compareFunction: (lhs, min, max) => min <= lhs && lhs <= max,
    key: "nfoIsInTheRange"
  }
};

Object.freeze(NumberFilterOperator);

export default NumberFilterOperator;
