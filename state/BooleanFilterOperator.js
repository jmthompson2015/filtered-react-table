const BooleanFilterOperator = {
  IS_TRUE: "bfoIsTrue",
  IS_FALSE: "bfoIsFalse"
};

BooleanFilterOperator.properties = {
  bfoIsTrue: {
    label: "is true",
    compareFunction: lhs => lhs === true,
    key: "bfoIsTrue"
  },
  bfoIsFalse: {
    label: "is false",
    compareFunction: lhs => lhs === false,
    key: "bfoIsFalse"
  }
};

Object.freeze(BooleanFilterOperator);

export default BooleanFilterOperator;
