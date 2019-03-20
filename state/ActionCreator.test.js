import ActionCreator from "./ActionCreator.js";
import ActionType from "./ActionType.js";

QUnit.module("ActionCreator");

QUnit.test("all action types", assert => {
  // Setup.
  const actionTypeKeys = Object.getOwnPropertyNames(ActionType);
  assert.equal(actionTypeKeys.length, 6);

  // Run / Verify.
  actionTypeKeys.forEach(key => {
    assert.ok(ActionCreator[ActionType[key]], `actionType = ${key} ${ActionType[key]}`);
  });
});

QUnit.test("removeFilters()", assert => {
  // Setup.

  // Run.
  const result = ActionCreator.removeFilters();

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.REMOVE_FILTERS);
});

QUnit.test("setDefaultFilters()", assert => {
  // Setup.

  // Run.
  const result = ActionCreator.setDefaultFilters();

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_DEFAULT_FILTERS);
});

QUnit.test("setFilters()", assert => {
  // Setup.
  const filters = 3;

  // Run.
  const result = ActionCreator.setFilters(filters);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_FILTERS);
  assert.equal(result.filters, filters);
});

const ActionCreatorTest = {};
export default ActionCreatorTest;
