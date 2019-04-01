import ActionCreator from "./ActionCreator.js";
import ActionType from "./ActionType.js";

QUnit.module("ActionCreator");

QUnit.test("all action types", assert => {
  // Setup.
  const actionTypeKeys = Object.getOwnPropertyNames(ActionType);
  assert.equal(actionTypeKeys.length, 7);

  // Run / Verify.
  actionTypeKeys.forEach(key => {
    assert.ok(ActionCreator[ActionType[key]], `actionType = ${key} ${ActionType[key]}`);
  });
});

QUnit.test("applyFilters()", assert => {
  // Setup.

  // Run.
  const result = ActionCreator.applyFilters();

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.APPLY_FILTERS);
});

QUnit.test("removeFilters()", assert => {
  // Setup.

  // Run.
  const result = ActionCreator.removeFilters();

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.REMOVE_FILTERS);
});

QUnit.test("setAppName()", assert => {
  // Setup.
  const appName = 3;

  // Run.
  const result = ActionCreator.setAppName(appName);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_APP_NAME);
  assert.equal(result.appName, appName);
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

QUnit.test("setTableColumns()", assert => {
  // Setup.
  const tableColumns = 3;

  // Run.
  const result = ActionCreator.setTableColumns(tableColumns);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_TABLE_COLUMNS);
  assert.equal(result.tableColumns, tableColumns);
});

QUnit.test("setTableRows()", assert => {
  // Setup.
  const tableRows = 3;

  // Run.
  const result = ActionCreator.setTableRows(tableRows);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_TABLE_ROWS);
  assert.equal(result.tableRows, tableRows);
});

QUnit.test("setVerbose()", assert => {
  // Setup.
  const isVerbose = true;

  // Run.
  const result = ActionCreator.setVerbose(isVerbose);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, ActionType.SET_VERBOSE);
  assert.equal(result.isVerbose, isVerbose);
});

const ActionCreatorTest = {};
export default ActionCreatorTest;
