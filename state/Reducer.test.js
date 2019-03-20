import AppState from "./AppState.js";
import ActionCreator from "./ActionCreator.js";
import Reducer from "./Reducer.js";

QUnit.module("Reducer");

QUnit.test("setFilters()", assert => {
  // Setup.
  const state = AppState.create();
  const filters = [];
  const action = ActionCreator.setFilters(filters);

  // Run.
  const result = Reducer.root(state, action);

  // Verify.
  assert.ok(result);
  assert.equal(result.filters, filters);
});

const ReducerTest = {};
export default ReducerTest;
