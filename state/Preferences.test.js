import Filter from "./Filter.js";
import NFO from "./NumberFilterOperator.js";
import Preferences from "./Preferences.js";

QUnit.module("Preferences");

const createFilters1 = () => [
  Filter.create({ columnKey: "red", operatorKey: NFO.IS_GREATER_THAN, rhs: 0 }),
  Filter.create({ columnKey: "green", operatorKey: NFO.IS_LESS_THAN, rhs: 128 })
];

const createFilters2 = () => [
  Filter.create({ columnKey: "blue", operatorKey: NFO.IS_GREATER_THAN, rhs: 0 })
];

QUnit.test("getFilters()", assert => {
  // Setup.
  const appName = "testAppName";
  const filters = createFilters1();
  localStorage.removeItem(appName);
  Preferences.setFilters(appName, filters);

  // Run.
  const result = Preferences.getFilters(appName, filters);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result), true, "result.filters is Array");
  assert.equal(result.join(), filters.join());
});

QUnit.test("setFilters()", assert => {
  // Setup.
  const appName = "testAppName";
  const filters1 = createFilters1();
  localStorage.removeItem(appName);

  // Run.
  Preferences.setFilters(appName, filters1);
  const result1 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result1);
  const newItem1 = JSON.parse(result1);
  assert.equal(Array.isArray(newItem1.filters), true, "newItem1.filters is an Array");
  assert.equal(JSON.stringify(newItem1.filters), JSON.stringify(filters1));

  // Setup.
  const filters2 = createFilters2();

  // Run.
  Preferences.setFilters(appName, filters2);
  const result2 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result2);
  const newItem2 = JSON.parse(result2);
  assert.equal(Array.isArray(newItem2.filters), true, "newItem2.filters is an Array");
  assert.equal(JSON.stringify(newItem2.filters), JSON.stringify(filters2));
});

const PreferencesTest = {};
export default PreferencesTest;
