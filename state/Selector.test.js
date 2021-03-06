import Reducer from "./Reducer.js";
import Selector from "./Selector.js";

QUnit.module("Selector");

QUnit.test("filteredTableRows()", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);

  // Run.
  const result = Selector.filteredTableRows(store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(result.join(), [].join());
});

QUnit.test("filterGroup()", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);

  // Run.
  const result = Selector.filterGroup(store.getState());

  // Verify.
  assert.equal(result, undefined);
});

QUnit.test("tableColumns()", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);

  // Run.
  const result = Selector.tableColumns(store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(result.join(), [].join());
});

QUnit.test("tableRows()", (assert) => {
  // Setup.
  const store = Redux.createStore(Reducer.root);

  // Run.
  const result = Selector.tableRows(store.getState());

  // Verify.
  assert.ok(result);
  assert.equal(result.join(), [].join());
});

const SelectorTest = {};
export default SelectorTest;
