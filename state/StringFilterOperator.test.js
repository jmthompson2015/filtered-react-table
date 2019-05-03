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
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() CONTAINS array", assert => {
  // Setup.
  const operatorKey = SFO.CONTAINS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(operator.compareFunction(["test", "something"], "th"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() CONTAINS or", assert => {
  // Setup.
  const operatorKey = SFO.CONTAINS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test something", "test | duh"), true);
  assert.equal(operator.compareFunction("test something", "th | duh"), true);
  assert.equal(operator.compareFunction("test something", "vi | duh"), false);
  assert.equal(operator.compareFunction("test something", "duh | test"), true);
  assert.equal(operator.compareFunction("test something", "duh | th"), true);
  assert.equal(operator.compareFunction("test something", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
  assert.equal(operator.compareFunction("test something", undefined), false);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN", assert => {
  // Setup.
  const operatorKey = SFO.DOES_NOT_CONTAIN;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st"), false);
  assert.equal(operator.compareFunction("test", "test"), false);
  assert.equal(operator.compareFunction("test", "vi"), true);
  assert.equal(operator.compareFunction(undefined, "vi"), true);
  assert.equal(operator.compareFunction("test", undefined), true);
  assert.equal(operator.compareFunction("test", ""), false);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN array", assert => {
  // Setup.
  const operatorKey = SFO.DOES_NOT_CONTAIN;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(operator.compareFunction(["test", "something"], "th"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), true);
});

QUnit.test("compareFunction() DOES_NOT_CONTAIN or", assert => {
  // Setup.
  const operatorKey = SFO.DOES_NOT_CONTAIN;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test something", "test | duh"), false);
  assert.equal(operator.compareFunction("test something", "th | duh"), false);
  assert.equal(operator.compareFunction("test something", "vi | duh"), true);
  assert.equal(operator.compareFunction("test something", "duh | test"), false);
  assert.equal(operator.compareFunction("test something", "duh | th"), false);
  assert.equal(operator.compareFunction("test something", "duh | vi"), true);
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
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), false);
});

QUnit.test("compareFunction() IS array", assert => {
  // Setup.
  const operatorKey = SFO.IS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test something"), true);
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(operator.compareFunction(["test", "something"], "something"), false);
  assert.equal(operator.compareFunction(["test", "something"], "te"), false);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() IS or", assert => {
  // Setup.
  const operatorKey = SFO.IS;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test | duh"), false);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "violet | duh"), false);
  assert.equal(operator.compareFunction(undefined, "violet | duh"), false);
  assert.equal(operator.compareFunction("store", "duh | test"), false);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | violet"), false);
  assert.equal(operator.compareFunction(undefined, "duh | violet"), false);
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
  assert.equal(operator.compareFunction("test", undefined), true);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() IS_NOT array", assert => {
  // Setup.
  const operatorKey = SFO.IS_NOT;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test something"), false);
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(operator.compareFunction(["test", "something"], "something"), true);
  assert.equal(operator.compareFunction(["test", "something"], "te"), true);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), true);
});

QUnit.test("compareFunction() IS_NOT or", assert => {
  // Setup.
  const operatorKey = SFO.IS_NOT;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("store", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "test | duh"), false);
  assert.equal(operator.compareFunction("test", "violet | duh"), true);
  assert.equal(operator.compareFunction(undefined, "violet | duh"), true);
  assert.equal(operator.compareFunction("store", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | test"), false);
  assert.equal(operator.compareFunction("test", "duh | violet"), true);
  assert.equal(operator.compareFunction(undefined, "duh | violet"), true);
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
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() BEGINS_WITH array", assert => {
  // Setup.
  const operatorKey = SFO.BEGINS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), true);
  assert.equal(operator.compareFunction(["test", "something"], "something"), false);
  assert.equal(operator.compareFunction(["test", "something"], "te"), true);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), false);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() BEGINS_WITH or", assert => {
  // Setup.
  const operatorKey = SFO.BEGINS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st | duh"), false);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "vi | duh"), false);
  assert.equal(operator.compareFunction(undefined, "vi | duh"), false);
  assert.equal(operator.compareFunction("test", "duh | st"), false);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
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
  assert.equal(operator.compareFunction("test", undefined), false);
  assert.equal(operator.compareFunction("test", ""), true);
});

QUnit.test("compareFunction() ENDS_WITH array", assert => {
  // Setup.
  const operatorKey = SFO.ENDS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction(["test", "something"], "test"), false);
  assert.equal(operator.compareFunction(["test", "something"], "something"), true);
  assert.equal(operator.compareFunction(["test", "something"], "te"), false);
  assert.equal(operator.compareFunction(["test", "something"], "ng"), true);
  assert.equal(operator.compareFunction(["test", "something"], "vi"), false);
});

QUnit.test("compareFunction() ENDS_WITH or", assert => {
  // Setup.
  const operatorKey = SFO.ENDS_WITH;
  const operator = SFO.properties[operatorKey];

  // Run / Verify.
  assert.equal(operator.compareFunction("test", "st | duh"), true);
  assert.equal(operator.compareFunction("test", "test | duh"), true);
  assert.equal(operator.compareFunction("test", "vi | duh"), false);
  assert.equal(operator.compareFunction(undefined, "vi | duh"), false);
  assert.equal(operator.compareFunction("test", "duh | st"), true);
  assert.equal(operator.compareFunction("test", "duh | test"), true);
  assert.equal(operator.compareFunction("test", "duh | vi"), false);
  assert.equal(operator.compareFunction(undefined, "duh | vi"), false);
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
