import EnumTest from "./Enum.test.js";
import EU from "./EnumUtilities.js";
import FilterType from "./FilterType.js";

QUnit.module("FilterType");

QUnit.test("FilterType properties BOOLEAN", assert => {
  const typeKey = FilterType.BOOLEAN;
  const properties = FilterType.properties[typeKey];
  assert.equal(properties.name, "Boolean");
  assert.equal(properties.key, typeKey);
});

QUnit.test("keys and values", assert => {
  EnumTest.keysAndValues(assert, FilterType);
});

QUnit.test("keys()", assert => {
  EnumTest.keys(assert, FilterType, 3, FilterType.BOOLEAN, FilterType.STRING);
});

QUnit.test("required properties", assert => {
  EU.values(FilterType).forEach(filter => {
    assert.ok(filter.name, `Missing name for ${filter.key}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const FilterTypeTest = {};
export default FilterTypeTest;
