import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import Reducer from "./Reducer.js";

const { Filter, FilterGroup, NumberOperator: NumberOp } = FilterJS;

QUnit.module("Reducer");

QUnit.test("setAppName()", (assert) => {
  // Setup.
  const state = AppState.create();
  const appName = "mySillyName";
  const action = ActionCreator.setAppName(appName);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.appName, appName);
});

QUnit.test("setDefaultSort()", (assert) => {
  // Setup.
  const state = AppState.create();
  const defaultSort = 12;
  const action = ActionCreator.setDefaultSort(defaultSort);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.defaultSort, defaultSort);
});

QUnit.test("setFilterGroup()", (assert) => {
  // Setup.
  const state = AppState.create();
  const filterGroup = FilterGroup.create({
    filters: [
      Filter.create({
        columnKey: "red",
        operatorKey: NumberOp.IS_GREATER_THAN,
        rhs: 0,
      }),
    ],
  });
  const action = ActionCreator.setFilterGroup(filterGroup);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.filterGroup, filterGroup);
});

QUnit.test("setTableColumns()", (assert) => {
  // Setup.
  const state = AppState.create();
  const tableColumns = [];
  const action = ActionCreator.setTableColumns(tableColumns);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.tableColumns.join(), tableColumns.join());
});

QUnit.test("setTableRows()", (assert) => {
  // Setup.
  const state = AppState.create();
  const tableRows = [];
  const action = ActionCreator.setTableRows(tableRows);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.tableRows.join(), tableRows.join());
});

QUnit.test("setVerbose()", (assert) => {
  // Setup.
  const state = AppState.create();
  const isVerbose = true;
  const action = ActionCreator.setVerbose(isVerbose);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.isVerbose, isVerbose);
});

const ReducerTest = {};
export default ReducerTest;
