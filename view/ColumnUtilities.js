const ColumnUtilities = {};

ColumnUtilities.createColorCell = (color, name) =>
  ReactDOMFactories.div({ style: { backgroundColor: color } }, name);

ColumnUtilities.createIcon = (iconUrl, name, width = 32) =>
  ReactDOMFactories.img({
    key: iconUrl,
    src: iconUrl,
    style: { width },
    title: name,
  });

ColumnUtilities.createLink = (href, name) =>
  ReactDOMFactories.a({ key: name, href, target: "_blank" }, name);

ColumnUtilities.createSpan = (label, fontColor = "red") =>
  ReactDOMFactories.span({ key: label, style: { color: fontColor } }, label);

ColumnUtilities.US_FORMATTER0 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

ColumnUtilities.US_FORMATTER2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

ColumnUtilities.formatNumber = (
  value,
  formatter = ColumnUtilities.US_FORMATTER0
) => (R.isNil(value) ? undefined : formatter.format(value));

ColumnUtilities.parseFloat = (value) =>
  !R.isNil(value) && typeof value === "string" ? parseFloat(value) : value;

ColumnUtilities.parseInt = (value) =>
  !R.isNil(value) && typeof value === "string" ? parseInt(value, 10) : value;

Object.freeze(ColumnUtilities);

export default ColumnUtilities;
