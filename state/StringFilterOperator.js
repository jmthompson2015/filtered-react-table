const StringFilterOperator = {
  CONTAINS: "sfoContains",
  DOES_NOT_CONTAIN: "sfoDoesNotContain",
  IS: "sfoIs",
  IS_NOT: "sfoIsNot",
  BEGINS_WITH: "sfoBeginsWith",
  ENDS_WITH: "sfoEndsWith"
};

StringFilterOperator.properties = {
  sfoContains: {
    label: "contains",
    compareFunction: (lhs, rhs) => lhs.includes(rhs),
    key: "sfoContains"
  },
  sfoDoesNotContain: {
    label: "does not contain",
    compareFunction: (lhs, rhs) => !lhs.includes(rhs),
    key: "sfoDoesNotContain"
  },
  sfoIs: {
    label: "is",
    compareFunction: (lhs, rhs) => lhs === rhs,
    key: "sfoIs"
  },
  sfoIsNot: {
    label: "is not",
    compareFunction: (lhs, rhs) => lhs !== rhs,
    key: "sfoIsNot"
  },
  sfoBeginsWith: {
    label: "begins with",
    compareFunction: (lhs, rhs) => lhs.startsWith(rhs),
    key: "sfoBeginsWith"
  },
  sfoEndsWith: {
    label: "ends with",
    compareFunction: (lhs, rhs) => lhs.endsWith(rhs),
    key: "sfoEndsWith"
  }
};

Object.freeze(StringFilterOperator);

export default StringFilterOperator;
