const Preferences = {};

const fetchItem = appName => {
  const oldItemString = localStorage.getItem(appName);

  return oldItemString !== undefined ? JSON.parse(oldItemString) : {};
};

Preferences.getFilters = appName => {
  const item = fetchItem(appName);

  return item && item.filters ? Immutable(item.filters) : Immutable([]);
};

Preferences.setFilters = (appName, filters) => {
  const oldItem = fetchItem(appName);
  const newItem = R.merge(oldItem, { filters });

  localStorage.setItem(appName, JSON.stringify(newItem));
};

Object.freeze(Preferences);

export default Preferences;
