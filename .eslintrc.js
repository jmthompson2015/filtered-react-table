module.exports = {
  env: {
    browser: true,
  },
  extends: ["airbnb", "prettier"],
  globals: {
    FilteredReactTable: true,
    FilterJS: true,
    Immutable: true,
    PropTypes: true,
    QUnit: true,
    R: true,
    React: true,
    Reactable: true,
    ReactDOM: true,
    ReactDOMFactories: true,
    ReactRedux: true,
    Redux: true,
  },
  rules: {
    "import/extensions": ["error", { js: "always" }],
    "max-len": ["error", { code: 100, ignoreUrls: true }],
  },
};
