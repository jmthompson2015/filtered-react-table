const EnumUtilities = {};

EnumUtilities.findByName = (name, enumClass) => EnumUtilities.findByProp("name", name, enumClass);

EnumUtilities.findByProp = (propertyName, propertyValue, enumClass) =>
  R.find(R.propEq(propertyName, propertyValue), EnumUtilities.values(enumClass));

EnumUtilities.keys = enumClass => Object.keys(enumClass.properties);

EnumUtilities.values = enumClass => Object.values(enumClass.properties);

Object.freeze(EnumUtilities);

export default EnumUtilities;
