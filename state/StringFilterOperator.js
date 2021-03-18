const StringFilterOperator = {
  CONTAINS: "sfoContains",
  DOES_NOT_CONTAIN: "sfoDoesNotContain",
  IS: "sfoIs",
  IS_NOT: "sfoIsNot",
  BEGINS_WITH: "sfoBeginsWith",
  ENDS_WITH: "sfoEndsWith",
};

const myCompareFunction = (lhs, rhs, myFunction) => {
  if (R.isNil(lhs) || R.isNil(rhs)) return false;

  const value = Array.isArray(lhs) ? lhs.join(" ") : lhs;

  if (rhs.includes("|")) {
    const parts = rhs.split("|");
    const reduceFunction = (accum, r) => myFunction(value, r.trim()) || accum;
    return R.reduce(reduceFunction, false, parts);
  }

  return myFunction(value, rhs);
};

const containsCompareFunction = (lhs, rhs) =>
  myCompareFunction(lhs, rhs, (value, r) =>
    R.toLower(value).includes(R.toLower(r))
  );

const isCompareFunction = (lhs, rhs) =>
  myCompareFunction(lhs, rhs, (value, r) => value === r);

StringFilterOperator.properties = {
  sfoContains: {
    label: "contains",
    compareFunction: containsCompareFunction,
    key: "sfoContains",
  },
  sfoDoesNotContain: {
    label: "does not contain",
    compareFunction: (lhs, rhs) => !containsCompareFunction(lhs, rhs),
    key: "sfoDoesNotContain",
  },
  sfoIs: {
    label: "is",
    compareFunction: isCompareFunction,
    key: "sfoIs",
  },
  sfoIsNot: {
    label: "is not",
    compareFunction: (lhs, rhs) => !isCompareFunction(lhs, rhs),
    key: "sfoIsNot",
  },
  sfoBeginsWith: {
    label: "begins with",
    compareFunction: (lhs, rhs) =>
      myCompareFunction(lhs, rhs, (value, r) => value.startsWith(r)),
    key: "sfoBeginsWith",
  },
  sfoEndsWith: {
    label: "ends with",
    compareFunction: (lhs, rhs) =>
      myCompareFunction(lhs, rhs, (value, r) => value.endsWith(r)),
    key: "sfoEndsWith",
  },
};

Object.freeze(StringFilterOperator);

export default StringFilterOperator;
