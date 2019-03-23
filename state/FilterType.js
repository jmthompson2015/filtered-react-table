const FilterType = {
  BOOLEAN: "boolean",
  NUMBER: "number",
  STRING: "string"
};

FilterType.properties = {
  boolean: {
    name: "Boolean",
    key: "boolean"
  },
  number: {
    name: "Number",
    key: "number"
  },
  string: {
    name: "String",
    key: "string"
  }
};

Object.freeze(FilterType);

export default FilterType;
