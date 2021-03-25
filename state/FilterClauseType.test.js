import EnumTest from "./Enum.test.js";
import EU from "./EnumUtilities.js";
import FilterClauseType from "./FilterClauseType.js";

QUnit.module("FilterClauseType");

QUnit.test("FilterClauseType properties BOOLEAN", (assert) => {
  const typeKey = FilterClauseType.BOOLEAN;
  const properties = FilterClauseType.properties[typeKey];
  assert.equal(properties.name, "Boolean");
  assert.equal(properties.key, typeKey);
});

QUnit.test("keys and values", (assert) => {
  EnumTest.keysAndValues(assert, FilterClauseType);
});

QUnit.test("keys()", (assert) => {
  EnumTest.keys(
    assert,
    FilterClauseType,
    3,
    FilterClauseType.BOOLEAN,
    FilterClauseType.STRING
  );
});

QUnit.test("required properties", (assert) => {
  EU.values(FilterClauseType).forEach((filter) => {
    assert.ok(filter.name, `Missing name for ${filter.key}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const FilterClauseTypeTest = {};
export default FilterClauseTypeTest;
