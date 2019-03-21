import BFO from "./BooleanFilterOperator.js";
import Filter from "./Filter.js";
import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";

QUnit.module("Filter");

QUnit.test("create() boolean", assert => {
  // Setup.
  const columnKey = "red";
  const operatorKey = BFO.IS_TRUE;

  // Run.
  const result = Filter.create({ columnKey, operatorKey });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
});

QUnit.test("create() number", assert => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;

  // Run.
  const result = Filter.create({ columnKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("create() string", assert => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";

  // Run.
  const result = Filter.create({ columnKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("isBooleanFilter()", assert => {
  // Setup.
  const columnKey = "name";

  // Run / Verify.
  assert.equal(
    Filter.isBooleanFilter(Filter.create({ columnKey, operatorKey: BFO.IS_TRUE })),
    true
  );
  assert.equal(
    Filter.isBooleanFilter(Filter.create({ columnKey, operatorKey: BFO.IS_FALSE })),
    true
  );
});

QUnit.test("isNumberFilter()", assert => {
  // Setup.
  const columnKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(Filter.isNumberFilter(Filter.create({ columnKey, operatorKey: NFO.IS, rhs })), true);
  assert.equal(
    Filter.isNumberFilter(Filter.create({ columnKey, operatorKey: NFO.IS_NOT, rhs })),
    true
  );
  assert.equal(
    Filter.isNumberFilter(Filter.create({ columnKey, operatorKey: NFO.IS_GREATER_THAN, rhs })),
    true
  );
  assert.equal(
    Filter.isNumberFilter(Filter.create({ columnKey, operatorKey: NFO.IS_LESS_THAN, rhs })),
    true
  );
  assert.equal(
    Filter.isNumberFilter(
      Filter.create({ columnKey, operatorKey: NFO.IS_IN_THE_RANGE, rhs, rhs2: 10 })
    ),
    true
  );
});

QUnit.test("isNumberFilter() undefined", assert => {
  // Setup.
  const filter = undefined;

  // Run.
  const result = Filter.isNumberFilter(filter);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isStringFilter()", assert => {
  // Setup.
  const columnKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(
    Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.CONTAINS, rhs })),
    true
  );
  assert.equal(
    Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.DOES_NOT_CONTAIN, rhs })),
    true
  );
  assert.equal(Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.IS, rhs })), true);
  assert.equal(
    Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.IS_NOT, rhs })),
    true
  );
  assert.equal(
    Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.BEGINS_WITH, rhs })),
    true
  );
  assert.equal(
    Filter.isStringFilter(Filter.create({ columnKey, operatorKey: SFO.ENDS_WITH, rhs })),
    true
  );
});

QUnit.test("isStringFilter() undefined", assert => {
  // Setup.
  const filter = undefined;

  // Run.
  const result = Filter.isStringFilter(filter);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("passes() boolean", assert => {
  // Setup.
  const columnKey = "liked";
  const operatorKey = BFO.IS_TRUE;
  const filter1 = Filter.create({ columnKey, operatorKey });
  const filter2 = Filter.create({ columnKey: "bogus", operatorKey });
  const filter3 = Filter.create({ columnKey, operatorKey: BFO.IS_FALSE });
  const data = { liked: true };

  // Run / Verify.
  assert.equal(Filter.passes(filter1, data), true, "filter1");
  assert.equal(Filter.passes(filter2, data), false, "filter2");
  assert.equal(Filter.passes(filter3, data), false, "filter3");
});

QUnit.test("passes() number", assert => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;
  const filter1 = Filter.create({ columnKey, operatorKey, rhs });
  const filter2 = Filter.create({ columnKey: "bogus", operatorKey, rhs });
  const filter3 = Filter.create({ columnKey, operatorKey: NFO.IS_LESS_THAN, rhs });
  const filter4 = Filter.create({ columnKey, operatorKey, rhs: 4 });
  const filter5 = Filter.create({
    columnKey,
    operatorKey: NFO.IS_IN_THE_RANGE,
    rhs: 10,
    rhs2: 20
  });
  const data = { red: 15 };

  // Run / Verify.
  assert.equal(Filter.passes(filter1, data), true, "filter1");
  assert.equal(Filter.passes(filter2, data), false, "filter2");
  assert.equal(Filter.passes(filter3, data), false, "filter3");
  assert.equal(Filter.passes(filter4, data), true, "filter4");
  assert.equal(Filter.passes(filter5, data), true, "filter5");
});

QUnit.test("passes() string", assert => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";
  const filter1 = Filter.create({ columnKey, operatorKey, rhs });
  const filter2 = Filter.create({ columnKey: "bogus", operatorKey, rhs });
  const filter3 = Filter.create({ columnKey, operatorKey: SFO.DOES_NOT_CONTAIN, rhs });
  const filter4 = Filter.create({ columnKey, operatorKey, rhs: "Re" });
  const data = { name: "Red" };

  // Run / Verify.
  assert.equal(Filter.passes(filter1, data), true, "filter1");
  assert.equal(Filter.passes(filter2, data), false, "filter2");
  assert.equal(Filter.passes(filter3, data), false, "filter3");
  assert.equal(Filter.passes(filter4, data), true, "filter4");
});

QUnit.test("passesAll()", assert => {
  // Setup.
  const filter1 = Filter.create({
    columnKey: "red",
    operatorKey: NFO.IS_GREATER_THAN,
    rhs: 127
  });
  const filter2 = Filter.create({ columnKey: "name", operatorKey: SFO.CONTAINS, rhs: "e" });
  const filters = [filter1, filter2];

  const data1 = { name: "Red", red: 255, green: 0, blue: 0, category: "Primary" };
  const data2 = { name: "Green", red: 0, green: 255, blue: 0, category: "Primary" };
  const data3 = { name: "Blue", red: 0, green: 0, blue: 255, category: "Primary" };
  const data4 = { name: "Yellow", red: 255, green: 255, blue: 0, category: "Secondary" };
  const data5 = { name: "Magenta", red: 255, green: 0, blue: 255, category: "Secondary" };
  const data6 = { name: "Cyan", red: 0, green: 255, blue: 255, category: "Secondary" };

  // Run / Verify.
  assert.equal(Filter.passesAll(filters, data1), true);
  assert.equal(Filter.passesAll(filters, data2), false);
  assert.equal(Filter.passesAll(filters, data3), false);
  assert.equal(Filter.passesAll(filters, data4), true);
  assert.equal(Filter.passesAll(filters, data5), true);
  assert.equal(Filter.passesAll(filters, data6), false);
});

QUnit.test("toString() boolean", assert => {
  // Setup.
  const columnKey = "liked";
  const operatorKey = BFO.IS_TRUE;
  const filter = Filter.create({ columnKey, operatorKey });

  // Run.
  const result = Filter.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, "Filter (liked is true)");
});

QUnit.test("toString() number", assert => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;
  const filter = Filter.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = Filter.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, "Filter (red is greater than 10)");
});

QUnit.test("toString() string", assert => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";
  const filter = Filter.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = Filter.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, 'Filter (name contains "ed")');
});

const FilterTest = {};
export default FilterTest;
