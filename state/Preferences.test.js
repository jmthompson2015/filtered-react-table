import NFO from "./NumberFilterOperator.js";
import Preferences from "./Preferences.js";

const { Clause, Filter, FilterGroup } = FilterJS;

QUnit.module("Preferences");

const createColumnToChecked1 = () => ({
  red: true,
  green: false,
});

const createColumnToChecked2 = () => ({
  blue: true,
});

const createFilters1 = () => {
  const clauses = [
    Clause.create({
      columnKey: "red",
      operatorKey: NFO.IS_GREATER_THAN,
      rhs: 0,
    }),
    Clause.create({
      columnKey: "green",
      operatorKey: NFO.IS_LESS_THAN,
      rhs: 128,
    }),
  ];
  const filter = Filter.create({ name: "Filter 23", clauses });

  return FilterGroup.create({ filters: [filter] });
};

const createFilters2 = () => {
  const clauses = [
    Clause.create({
      columnKey: "blue",
      operatorKey: NFO.IS_GREATER_THAN,
      rhs: 0,
    }),
  ];
  const filter = Filter.create({ name: "Filter 34", clauses });

  return FilterGroup.create({ filters: [filter] });
};

QUnit.test("getColumnToChecked()", (assert) => {
  // Setup.
  const appName = "testAppName";
  const columnToChecked = createColumnToChecked1();
  localStorage.removeItem(appName);
  Preferences.setColumnToChecked(appName, columnToChecked);

  // Run.
  const result = Preferences.getColumnToChecked(appName);

  // Verify.
  assert.ok(result);
  assert.equal(JSON.stringify(result), JSON.stringify(columnToChecked));
});

QUnit.test("setColumnToChecked()", (assert) => {
  // Setup.
  const appName = "testAppName";
  const columnToChecked1 = createColumnToChecked1();
  localStorage.removeItem(appName);

  // Run.
  Preferences.setColumnToChecked(appName, columnToChecked1);
  const result1 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result1);
  const newItem1 = JSON.parse(result1);
  assert.equal(
    JSON.stringify(newItem1.columnToChecked),
    JSON.stringify(columnToChecked1)
  );

  // Setup.
  const columnToChecked2 = createColumnToChecked2();

  // Run.
  Preferences.setColumnToChecked(appName, columnToChecked2);
  const result2 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result2);
  const newItem2 = JSON.parse(result2);
  assert.equal(
    JSON.stringify(newItem2.columnToChecked),
    JSON.stringify(columnToChecked2)
  );
});

QUnit.test("getFilterGroup()", (assert) => {
  // Setup.
  const appName = "testAppName";
  const filterGroup = createFilters1();
  localStorage.removeItem(appName);
  Preferences.setFilterGroup(appName, filterGroup);

  // Run.
  const result = Preferences.getFilterGroup(appName);

  // Verify.
  assert.ok(result);
  assert.equal(Array.isArray(result.filters), true, "result.filters is Array");
  assert.equal(result.selectedIndex, filterGroup.selectedIndex);
  assert.equal(result.filters.join(), filterGroup.filters.join());
});

QUnit.test("setFilterGroup()", (assert) => {
  // Setup.
  const appName = "testAppName";
  const filterGroup1 = createFilters1();
  localStorage.removeItem(appName);

  // Run.
  Preferences.setFilterGroup(appName, filterGroup1);
  const result1 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result1);
  const newItem1 = JSON.parse(result1).filterGroup;
  assert.equal(
    Array.isArray(newItem1.filters),
    true,
    "newItem1.filters is an Array"
  );
  assert.equal(
    JSON.stringify(newItem1.filters),
    JSON.stringify(filterGroup1.filters)
  );

  // Setup.
  const filterGroup2 = createFilters2();

  // Run.
  Preferences.setFilterGroup(appName, filterGroup2);
  const result2 = localStorage.getItem(appName);

  // Verify.
  assert.ok(result2);
  const newItem2 = JSON.parse(result2).filterGroup;
  assert.equal(
    Array.isArray(newItem2.filters),
    true,
    "newItem2.filters is an Array"
  );
  assert.equal(
    JSON.stringify(newItem2.filters),
    JSON.stringify(filterGroup2.filters)
  );
});

const PreferencesTest = {};
export default PreferencesTest;
