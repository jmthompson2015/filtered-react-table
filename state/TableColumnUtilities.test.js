import TCU from "./TableColumnUtilities.js";

QUnit.module("TableColumnUtilities");

QUnit.test("determineValue()", assert => {
  // Setup.
  const column = { key: "red", label: "Red" };
  const row = { red: 255, green: 0, blue: 0 };

  // Run.
  const result = TCU.determineValue(column, row);

  // Verify.
  assert.ok(result);
  assert.equal(result, 255);
});

QUnit.test("tableColumn() bogus", assert => {
  // Setup.
  const tableColumns = [
    { key: "red", label: "Red" },
    { key: "green", label: "Green" },
    { key: "blue", label: "Blue" }
  ];
  const columnKey = "bogus";

  // Run.
  const result = TCU.tableColumn(tableColumns, columnKey);

  // Verify.
  assert.equal(result, undefined);
});

QUnit.test("tableColumn() green", assert => {
  // Setup.
  const tableColumns = [
    { key: "red", label: "Red" },
    { key: "green", label: "Green" },
    { key: "blue", label: "Blue" }
  ];
  const columnKey = "green";

  // Run.
  const result = TCU.tableColumn(tableColumns, columnKey);

  // Verify.
  assert.ok(result);
  assert.equal(result.key, columnKey);
  assert.equal(result.label, "Green");
});

const TableColumnUtilitiesTest = {};
export default TableColumnUtilitiesTest;
