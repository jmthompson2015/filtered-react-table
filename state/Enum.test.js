import EnumUtilities from "./EnumUtilities.js";

const EnumTest = {};

EnumTest.keysAndValues = (assert, enumClass) => {
  // Run.
  const result = EnumUtilities.keys(enumClass);
  const ownPropertyNames = Object.getOwnPropertyNames(enumClass);

  // Verify.
  ownPropertyNames.forEach(key => {
    const key2 = enumClass[key];

    if (key !== "properties" && typeof key2 === "string") {
      assert.ok(enumClass.properties[key2], `Missing value for key = ${key}`);
    }
  });

  result.forEach(value => {
    const p = ownPropertyNames.filter(key => enumClass[key] === value);

    assert.equal(p.length, 1, `Missing key for value = ${value}`);
  });
};

EnumTest.keys = (assert, enumClass, length, firstElement, lastElement) => {
  // Run.
  const result = EnumUtilities.keys(enumClass);

  // Verify.
  assert.ok(result);
  assert.equal(result.length, length);
  assert.equal(result[0], firstElement);
  assert.equal(result[length - 1], lastElement);
  assert.ok(!result[length]);

  const properties = Object.getOwnPropertyNames(enumClass);
  // console.log(`EnumTest.keys() properties = ${properties}`);
  const count = properties.length - 1; // properties
  assert.equal(result.length, count);
};

export default EnumTest;
