const FilterClauseType = {
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string",
};

FilterClauseType.properties = {
  boolean: {
    name: "Boolean",
    key: "boolean",
  },
  number: {
    name: "Number",
    key: "number",
  },
  string: {
    name: "String",
    key: "string",
  },
};

Object.freeze(FilterClauseType);

export default FilterClauseType;
