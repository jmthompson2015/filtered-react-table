import BFO from "./BooleanFilterOperator.js";
import FilterClause from "./FilterClause.js";
import FilterClauseType from "./FilterClauseType.js";
import NFO from "./NumberFilterOperator.js";
import SFO from "./StringFilterOperator.js";

QUnit.module("FilterClause");

QUnit.test("create() boolean", (assert) => {
  // Setup.
  const columnKey = "red";
  const operatorKey = BFO.IS_TRUE;

  // Run.
  const result = FilterClause.create({ columnKey, operatorKey });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
});

QUnit.test("create() number", (assert) => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;

  // Run.
  const result = FilterClause.create({ columnKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("create() string", (assert) => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";

  // Run.
  const result = FilterClause.create({ columnKey, operatorKey, rhs });

  // Verify.
  assert.ok(result);
  assert.equal(result.columnKey, columnKey);
  assert.equal(result.operatorKey, operatorKey);
  assert.equal(result.rhs, rhs);
});

QUnit.test("isBooleanFilterClause()", (assert) => {
  // Setup.
  const columnKey = "name";

  // Run / Verify.
  assert.equal(
    FilterClause.isBooleanFilterClause(
      FilterClause.create({ columnKey, operatorKey: BFO.IS_TRUE })
    ),
    true
  );
  assert.equal(
    FilterClause.isBooleanFilterClause(
      FilterClause.create({ columnKey, operatorKey: BFO.IS_FALSE })
    ),
    true
  );
});

QUnit.test("isNumberFilterClause()", (assert) => {
  // Setup.
  const columnKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(
    FilterClause.isNumberFilterClause(
      FilterClause.create({ columnKey, operatorKey: NFO.IS, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isNumberFilterClause(
      FilterClause.create({ columnKey, operatorKey: NFO.IS_NOT, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isNumberFilterClause(
      FilterClause.create({ columnKey, operatorKey: NFO.IS_GREATER_THAN, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isNumberFilterClause(
      FilterClause.create({ columnKey, operatorKey: NFO.IS_LESS_THAN, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isNumberFilterClause(
      FilterClause.create({
        columnKey,
        operatorKey: NFO.IS_IN_THE_RANGE,
        rhs,
        rhs2: 10,
      })
    ),
    true
  );
});

QUnit.test("isNumberFilterClause() undefined", (assert) => {
  // Setup.
  const filter = undefined;

  // Run.
  const result = FilterClause.isNumberFilterClause(filter);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("isStringFilterClause()", (assert) => {
  // Setup.
  const columnKey = "name";
  const rhs = 5;

  // Run / Verify.
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.CONTAINS, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.DOES_NOT_CONTAIN, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.IS, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.IS_NOT, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.BEGINS_WITH, rhs })
    ),
    true
  );
  assert.equal(
    FilterClause.isStringFilterClause(
      FilterClause.create({ columnKey, operatorKey: SFO.ENDS_WITH, rhs })
    ),
    true
  );
});

QUnit.test("isStringFilterClause() undefined", (assert) => {
  // Setup.
  const filter = undefined;

  // Run.
  const result = FilterClause.isStringFilterClause(filter);

  // Verify.
  assert.equal(result, false);
});

QUnit.test("passes() boolean", (assert) => {
  // Setup.
  const tableColumns = [{ key: "liked", label: "Liked" }];
  const columnKey = "liked";
  const operatorKey = BFO.IS_TRUE;
  const filter1 = FilterClause.create({ columnKey, operatorKey });
  const filter2 = FilterClause.create({ columnKey: "bogus", operatorKey });
  const filter3 = FilterClause.create({ columnKey, operatorKey: BFO.IS_FALSE });
  const data = { liked: true };

  // Run / Verify.
  assert.equal(
    FilterClause.passes(tableColumns, filter1, data),
    true,
    "filter1"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter2, data),
    false,
    "filter2"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter3, data),
    false,
    "filter3"
  );
});

QUnit.test("passes() number", (assert) => {
  // Setup.
  const tableColumns = [{ key: "red", label: "Red" }];
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;
  const filter1 = FilterClause.create({ columnKey, operatorKey, rhs });
  const filter2 = FilterClause.create({ columnKey: "bogus", operatorKey, rhs });
  const filter3 = FilterClause.create({
    columnKey,
    operatorKey: NFO.IS_LESS_THAN,
    rhs,
  });
  const filter4 = FilterClause.create({ columnKey, operatorKey, rhs: 4 });
  const filter5 = FilterClause.create({
    columnKey,
    operatorKey: NFO.IS_IN_THE_RANGE,
    rhs: 10,
    rhs2: 20,
  });
  const data = { red: 15 };

  // Run / Verify.
  assert.equal(
    FilterClause.passes(tableColumns, filter1, data),
    true,
    "filter1"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter2, data),
    false,
    "filter2"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter3, data),
    false,
    "filter3"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter4, data),
    true,
    "filter4"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter5, data),
    true,
    "filter5"
  );
});

QUnit.test("passes() string", (assert) => {
  // Setup.
  const tableColumns = [{ key: "name", label: "Name" }];
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";
  const filter1 = FilterClause.create({ columnKey, operatorKey, rhs });
  const filter2 = FilterClause.create({ columnKey: "bogus", operatorKey, rhs });
  const filter3 = FilterClause.create({
    columnKey,
    operatorKey: SFO.DOES_NOT_CONTAIN,
    rhs,
  });
  const filter4 = FilterClause.create({ columnKey, operatorKey, rhs: "Re" });
  const data = { name: "Red" };

  // Run / Verify.
  assert.equal(
    FilterClause.passes(tableColumns, filter1, data),
    true,
    "filter1"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter2, data),
    false,
    "filter2"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter3, data),
    false,
    "filter3"
  );
  assert.equal(
    FilterClause.passes(tableColumns, filter4, data),
    true,
    "filter4"
  );
});

QUnit.test("passesAll()", (assert) => {
  // Setup.
  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "red", label: "Red", type: "number" },
    { key: "green", label: "Green", type: "number" },
    { key: "blue", label: "Blue", type: "number" },
    { key: "category", label: "Category" },
  ];
  const filter1 = FilterClause.create({
    columnKey: "red",
    operatorKey: NFO.IS_GREATER_THAN,
    rhs: 127,
  });
  const filter2 = FilterClause.create({
    columnKey: "name",
    operatorKey: SFO.CONTAINS,
    rhs: "e",
  });
  const filters = [filter1, filter2];

  const data1 = {
    name: "Red",
    red: 255,
    green: 0,
    blue: 0,
    category: "Primary",
  };
  const data2 = {
    name: "Green",
    red: 0,
    green: 255,
    blue: 0,
    category: "Primary",
  };
  const data3 = {
    name: "Blue",
    red: 0,
    green: 0,
    blue: 255,
    category: "Primary",
  };
  const data4 = {
    name: "Yellow",
    red: 255,
    green: 255,
    blue: 0,
    category: "Secondary",
  };
  const data5 = {
    name: "Magenta",
    red: 255,
    green: 0,
    blue: 255,
    category: "Secondary",
  };
  const data6 = {
    name: "Cyan",
    red: 0,
    green: 255,
    blue: 255,
    category: "Secondary",
  };

  // Run / Verify.
  assert.equal(FilterClause.passesAll(tableColumns, filters, data1), true);
  assert.equal(FilterClause.passesAll(tableColumns, filters, data2), false);
  assert.equal(FilterClause.passesAll(tableColumns, filters, data3), false);
  assert.equal(FilterClause.passesAll(tableColumns, filters, data4), true);
  assert.equal(FilterClause.passesAll(tableColumns, filters, data5), true);
  assert.equal(FilterClause.passesAll(tableColumns, filters, data6), false);
});

QUnit.test("toString() boolean", (assert) => {
  // Setup.
  const columnKey = "liked";
  const operatorKey = BFO.IS_TRUE;
  const filter = FilterClause.create({ columnKey, operatorKey });

  // Run.
  const result = FilterClause.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, "FilterClause (liked is true)");
});

QUnit.test("toString() number", (assert) => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;
  const filter = FilterClause.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = FilterClause.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, "FilterClause (red is greater than 10)");
});

QUnit.test("toString() string", (assert) => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";
  const filter = FilterClause.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = FilterClause.toString(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, 'FilterClause (name contains "ed")');
});

QUnit.test("typeKey() boolean", (assert) => {
  // Setup.
  const columnKey = "liked";
  const operatorKey = BFO.IS_TRUE;
  const filter = FilterClause.create({ columnKey, operatorKey });

  // Run.
  const result = FilterClause.typeKey(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, FilterClauseType.BOOLEAN);
});

QUnit.test("typeKey() number", (assert) => {
  // Setup.
  const columnKey = "red";
  const operatorKey = NFO.IS_GREATER_THAN;
  const rhs = 10;
  const filter = FilterClause.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = FilterClause.typeKey(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, FilterClauseType.NUMBER);
});

QUnit.test("typeKey() string", (assert) => {
  // Setup.
  const columnKey = "name";
  const operatorKey = SFO.CONTAINS;
  const rhs = "ed";
  const filter = FilterClause.create({ columnKey, operatorKey, rhs });

  // Run.
  const result = FilterClause.typeKey(filter);

  // Verify.
  assert.ok(result);
  assert.equal(result, FilterClauseType.STRING);
});

const FilterClauseTest = {};
export default FilterClauseTest;
