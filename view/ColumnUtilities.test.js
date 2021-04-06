import ColumnUtils from "./ColumnUtilities.js";

QUnit.module("ColumnUtilities");

QUnit.test("createColorCell()", (assert) => {
  // Setup.
  const color = "Red";
  const name = "My Name";

  // Run.
  const result = ColumnUtils.createColorCell(color, name);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, "div");
  const { props } = result;
  assert.ok(props);
  assert.equal(props.children, name);
  const { style } = props;
  assert.ok(style);
  assert.equal(style.backgroundColor, color);
});

QUnit.test("createIcon()", (assert) => {
  // Setup.
  const iconUrl = "https://some/location/icon.png";
  const name = "My Name";
  const width = 48;

  // Run.
  const result = ColumnUtils.createIcon(iconUrl, name, width);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, "img");
  assert.equal(result.key, iconUrl);
  const { props } = result;
  assert.ok(props);
  assert.equal(props.src, iconUrl);
  const { style } = props;
  assert.ok(style);
  assert.equal(style.width, width);
});

QUnit.test("createImageLink()", (assert) => {
  // Setup.
  const src = "https://some/location/icon.png";
  const href = "https://some/location/page.html";
  const title = "My Title";

  // Run.
  const result = ColumnUtils.createImageLink(src, href, title);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, "a");
  assert.equal(result.key, src);
  const { props } = result;
  assert.ok(props);
  assert.equal(props.href, href);
  assert.equal(props.title, title);
  const child = props.children;
  assert.ok(child);
  assert.equal(child.type, "img");
  const childProps = child.props;
  assert.ok(childProps);
  assert.equal(childProps.src, src);
});

QUnit.test("createLink()", (assert) => {
  // Setup.
  const href = "https://some/location/page.html";
  const name = "My Name";

  // Run.
  const result = ColumnUtils.createLink(href, name);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, "a");
  assert.equal(result.key, name);
  const { props } = result;
  assert.ok(props);
  assert.equal(props.href, href);
  assert.equal(props.children, name);
});

QUnit.test("createSpan()", (assert) => {
  // Setup.
  const label = "My Label";
  const fontColor = "Red";

  // Run.
  const result = ColumnUtils.createSpan(label, fontColor);

  // Verify.
  assert.ok(result);
  assert.equal(result.type, "span");
  assert.equal(result.key, label);
  const { props } = result;
  assert.ok(props);
  assert.equal(props.children, label);
  const { style } = props;
  assert.ok(style);
  assert.equal(style.color, fontColor);
});

QUnit.test("formatNumber()", (assert) => {
  // Setup.
  const value = 123456.789;

  // Run.
  const result = ColumnUtils.formatNumber(value);

  // Verify.
  assert.ok(result);
  assert.equal(result, "123,457");
});

QUnit.test("formatNumber() 2", (assert) => {
  // Setup.
  const value = 123456.789;
  const formatter = ColumnUtils.US_FORMATTER2;

  // Run.
  const result = ColumnUtils.formatNumber(value, formatter);

  // Verify.
  assert.ok(result);
  assert.equal(result, "123,456.79");
});

QUnit.test("parseFloat()", (assert) => {
  // Setup.
  const value = "1234.56";

  // Run.
  const result = ColumnUtils.parseFloat(value);

  // Verify.
  assert.ok(result);
  assert.equal(result, 1234.56);
});

QUnit.test("parseInt()", (assert) => {
  // Setup.
  const value = "1234";

  // Run.
  const result = ColumnUtils.parseInt(value);

  // Verify.
  assert.ok(result);
  assert.equal(result, 1234);
});

const ColumnUtilitiesTest = {};
export default ColumnUtilitiesTest;
