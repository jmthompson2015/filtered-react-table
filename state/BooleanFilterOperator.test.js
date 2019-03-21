import EnumTest from "./Enum.test.js";
import EU from "./EnumUtilities.js";
import BFO from "./BooleanFilterOperator.js";

QUnit.module("BooleanFilterOperator");

QUnit.test("BooleanFilterOperator properties IS_TRUE", assert => {
  const operatorKey = BFO.IS_TRUE;
  const properties = BFO.properties[operatorKey];
  assert.equal(properties.label, "is true");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() IS_TRUE", assert => {
  // Setup.
  const operatorKey = BFO.IS_TRUE;
  const operator = BFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(true), true);
  assert.equal(operator.compareFunction(false), false);
  assert.equal(operator.compareFunction(undefined), false);
});

QUnit.test("compareFunction() IS_FALSE", assert => {
  // Setup.
  const operatorKey = BFO.IS_FALSE;
  const operator = BFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(true), false);
  assert.equal(operator.compareFunction(false), true);
  assert.equal(operator.compareFunction(undefined), false);
});

QUnit.test("keys and values", assert => {
  EnumTest.keysAndValues(assert, BFO);
});

QUnit.test("keys()", assert => {
  EnumTest.keys(assert, BFO, 2, BFO.IS_TRUE, BFO.IS_FALSE);
});

QUnit.test("required properties", assert => {
  EU.values(BFO).forEach(filter => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const BooleanFilterOperatorTest = {};
export default BooleanFilterOperatorTest;
