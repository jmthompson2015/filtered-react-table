import EnumTest from "./Enum.test.js";
import EU from "./EnumUtilities.js";
import SFO from "./StringFilterOperator.js";

QUnit.module("StringFilterOperator");

QUnit.test("StringFilterOperator properties contains", assert => {
  const operatorKey = SFO.CONTAINS;
  const properties = SFO.properties[operatorKey];
  assert.equal(properties.label, "contains");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("StringFilterOperator properties ends with", assert => {
  const operatorKey = SFO.ENDS_WITH;
  const properties = SFO.properties[operatorKey];
  assert.equal(properties.label, "ends with");
  assert.equal(properties.key, operatorKey);
});

QUnit.test("compareFunction() CONTAINS", assert => {
  // Setup.
  const operatorKey = SFO.CONTAINS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), true);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN", assert => {
  // Setup.
  const operatorKey = SFO.DOES_NOT_CONTAIN;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), false);
  assert.equal(operator.compareFunction("test", "test"), false);
  assert.equal(operator.compareFunction("test", "vi"), true);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
});

QUnit.test("compareFunction() IS", assert => {
  // Setup.
  const operatorKey = SFO.IS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test"), false);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "violet"), false);
  assert.equal(operator.compareFunction(undefined, "violet"), false);
});

QUnit.test("compareFunction() IS_NOT", assert => {
  // Setup.
  const operatorKey = SFO.IS_NOT;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test"), true);
  assert.equal(operator.compareFunction("test", "test"), false);
  assert.equal(operator.compareFunction("test", "violet"), true);
  assert.equal(operator.compareFunction(undefined, "violet"), true);
});

QUnit.test("compareFunction() BEGINS_WITH", assert => {
  // Setup.
  const operatorKey = SFO.BEGINS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), false);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
});

QUnit.test("compareFunction() ENDS_WITH", assert => {
  // Setup.
  const operatorKey = SFO.ENDS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), true);
  assert.equal(operator.compareFunction("test", "test"), true);
  assert.equal(operator.compareFunction("test", "vi"), false);
  assert.equal(operator.compareFunction(undefined, "vi"), false);
});

QUnit.test("keys and values", assert => {
  EnumTest.keysAndValues(assert, SFO);
});

QUnit.test("keys()", assert => {
  EnumTest.keys(assert, SFO, 6, SFO.CONTAINS, SFO.ENDS_WITH);
});

QUnit.test("required properties", assert => {
  EU.values(SFO).forEach(filter => {
    assert.ok(filter.label, `Missing label for ${filter.label}`);
    assert.ok(filter.key, `Missing key for ${filter.label}`);
  });
});

const StringFilterOperatorTest = {};
export default StringFilterOperatorTest;
