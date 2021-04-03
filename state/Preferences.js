const Preferences = {};

const fetchItem = (appName) => {
  const oldItemString = localStorage.getItem(appName);

  return oldItemString !== undefined ? JSON.parse(oldItemString) : {};
};

Preferences.getColumnToChecked = (appName) => {
  const item = fetchItem(appName);

  return item && item.columnToChecked
    ? Immutable(item.columnToChecked)
    : Immutable({});
};

Preferences.setColumnToChecked = (appName, columnToChecked) => {
  const oldItem = fetchItem(appName);
  const newItem = R.merge(oldItem, { columnToChecked });

  localStorage.setItem(appName, JSON.stringify(newItem));
};

Preferences.getFilterGroup = (appName) => {
  const item = fetchItem(appName);

  return item && item.filterGroup ? Immutable(item.filterGroup) : Immutable([]);
};

Preferences.setFilterGroup = (appName, filterGroup) => {
  const oldItem = fetchItem(appName);
  const newItem = R.merge(oldItem, { filterGroup });

  localStorage.setItem(appName, JSON.stringify(newItem));
};

Object.freeze(Preferences);

export default Preferences;
