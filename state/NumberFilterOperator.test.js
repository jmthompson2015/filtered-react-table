import EnumTest from "./Enum.test.js";
import EU from "./EnumUtilities.js";
import NFO from "./NumberFilterOperator.js";

QUnit.module("NumberFilterOperator");

QUnit.test("NumberFilterOperator properties is", assert => {
  const operatorKey = NFO.IS;
  const properties = NFO.properties[operatorKey];
  assert.equal(properties.label, "is");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("NumberFilterOperator properties is in the range", assert => {
  const operatorKey = NFO.IS_IN_THE_RANGE;
  const properties = NFO.properties[operatorKey];
  assert.equal(properties.label, "is in the range");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() IS", assert => {
  // Setup.
  const operatorKey = NFO.IS;
  const operator = NFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), false);
  assert.equal(operator.compareFunction(5, 5), true);
  assert.equal(operator.compareFunction(5, 6), false);
});

QUnit.test("compareFunction() IS_NOT", assert => {
  // Setup.
  const operatorKey = NFO.IS_NOT;
  const operator = NFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), true);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 6), true);
});

QUnit.test("compareFunction() IS_GREATER_THAN", assert => {
  // Setup.
  const operatorKey = NFO.IS_GREATER_THAN;
  const operator = NFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), false);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 4), true);
});

QUnit.test("compareFunction() IS_LESS_THAN", assert => {
  // Setup.
  const operatorKey = NFO.IS_LESS_THAN;
  const operator = NFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 5), true);
  assert.equal(operator.compareFunction(5, 5), false);
  assert.equal(operator.compareFunction(5, 6), true);
});

QUnit.test("compareFunction() IS_IN_THE_RANGE", assert => {
  // Setup.
  const operatorKey = NFO.IS_IN_THE_RANGE;
  const operator = NFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(4, 0, 5), true);
  assert.equal(operator.compareFunction(5, 0, 5), true);
  assert.equal(operator.compareFunction(6, 0, 5), false);
});

QUnit.test("keys and values", assert => {
  EnumTest.keysAndValues(assert, NFO);
});

QUnit.test("keys()", assert => {
  EnumTest.keys(assert, NFO, 5, NFO.IS, NFO.IS_IN_THE_RANGE);
});

QUnit.test("required properties", assert => {
  EU.values(NFO).forEach(filter => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const NumberFilterOperatorTest = {};
export default NumberFilterOperatorTest;
