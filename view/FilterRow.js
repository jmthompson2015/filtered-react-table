import BFO from "../state/BooleanFilterOperator.js";
import EU from "../state/EnumUtilities.js";
import FilterClause from "../state/FilterClause.js";
import FilterClauseType from "../state/FilterClauseType.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";
import TCU from "../state/TableColumnUtilities.js";

import NumberInput from "./NumberInput.js";
import ReactUtils from "./ReactUtilities.js";
import Select from "./Select.js";
import StringInput from "./StringInput.js";

const asNumber = (value) => {
  if (typeof value === "string") {
    return Number(value);
  }
  return value;
};

const columnFor = (tableColumns, filter) => {
  const firstColumnKey = Object.values(tableColumns)[0].key;
  const columnKey = filter
    ? filter.columnKey || firstColumnKey
    : firstColumnKey;

  return TCU.tableColumn(tableColumns, columnKey);
};

const columnFromDocument = (tableColumns, index) => {
  const element = document.getElementById(`columnSelect${index}`);
  const columnKey = element.value;

  return TCU.tableColumn(tableColumns, columnKey);
};

const createAddButton = (handleOnClick) =>
  ReactDOMFactories.button({ onClick: handleOnClick }, "+");

const createColumnSelect = (
  tableColumns,
  filter,
  index,
  column,
  handleChange
) =>
  React.createElement(Select, {
    id: `columnSelect${index}`,
    values: tableColumns,
    initialValue: column.key,
    onChange: handleChange,
  });

const createEmptyCell = (key) => ReactUtils.createCell("", key);

const operatorsFor = (column) => {
  let answer;

  switch (column.type) {
    case FilterClauseType.BOOLEAN:
      answer = BFO;
      break;
    case FilterClauseType.NUMBER:
      answer = NFO;
      break;
    case FilterClauseType.STRING:
    case undefined:
      answer = SFO;
      break;
    default:
      throw new Error(`Unknown column.type: ${column.type}`);
  }

  return EU.values(answer);
};

const createOperatorSelect = (filter, index, column, handleChange) => {
  const operators = operatorsFor(column);

  return React.createElement(Select, {
    id: `operatorSelect${index}`,
    values: operators,
    initialValue: filter ? filter.operatorKey : undefined,
    onChange: handleChange,
  });
};

const createBooleanFilterClauseUI = (index) => [
  createEmptyCell(`rhsBooleanField1${index}`),
  createEmptyCell(`rhsBooleanField2${index}`),
  createEmptyCell(`rhsBooleanField3${index}`),
];

const createNumberFilterClauseUI = (
  filter,
  index,
  handleChange,
  min,
  max,
  step
) => {
  const idKey = `rhsField${index}`;
  const rhs = filter ? asNumber(filter.rhs) : undefined;
  if (filter.operatorKey === NFO.IS_IN_THE_RANGE) {
    const rhs2 = filter ? asNumber(filter.rhs2) : undefined;
    return [
      ReactUtils.createCell(
        React.createElement(NumberInput, {
          id: idKey,
          className: "field",
          initialValue: rhs,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs1NumberField1${index}`
      ),
      ReactUtils.createCell(
        ReactDOMFactories.span(
          { style: { paddingLeft: 3, paddingRight: 3 } },
          "to"
        ),
        `toField${index}`
      ),
      ReactUtils.createCell(
        React.createElement(NumberInput, {
          id: `rhs2Field${index}`,
          className: "field",
          initialValue: rhs2,
          max,
          min,
          step,
          onBlur: handleChange,
        }),
        `rhs2NumberField3${index}`
      ),
    ];
  }

  return [
    ReactUtils.createCell(
      React.createElement(NumberInput, {
        id: idKey,
        className: "field",
        initialValue: rhs,
        max,
        min,
        step,
        onBlur: handleChange,
      }),
      `rhsNumberField1${index}`
    ),
    createEmptyCell(`rhsNumberField2${index}`),
    createEmptyCell(`rhsNumberField3${index}`),
  ];
};

const createStringFilterClauseUI = (filter, index, handleChange) => {
  const idKey = `rhsField${index}`;
  return [
    ReactUtils.createCell(
      React.createElement(StringInput, {
        id: idKey,
        className: "field",
        initialValue: filter ? filter.rhs : undefined,
        onBlur: handleChange,
      }),
      `rhsStringField1${index}`
    ),
    createEmptyCell(`rhsStringField2${index}`),
    createEmptyCell(`rhsStringField3${index}`),
  ];
};

const createFilterClauseUI = (filter, index, handleChange, min, max, step) => {
  const typeKey = FilterClause.typeKey(filter);

  let answer;

  switch (typeKey) {
    case FilterClauseType.BOOLEAN:
      answer = createBooleanFilterClauseUI(index);
      break;
    case FilterClauseType.NUMBER:
      answer = createNumberFilterClauseUI(
        filter,
        index,
        handleChange,
        min,
        max,
        step
      );
      break;
    case FilterClauseType.STRING:
      answer = createStringFilterClauseUI(filter, index, handleChange);
      break;
    default:
      throw new Error(`Unknown filter typeKey: ${typeKey}`);
  }

  return answer;
};

const createRemoveButton = (isRemoveHidden, handleOnClick) =>
  ReactDOMFactories.button(
    { hidden: isRemoveHidden, onClick: handleOnClick },
    "-"
  );

const operatorKeyFromDocument = (column, index) => {
  const element = document.getElementById(`operatorSelect${index}`);
  const operatorKey = element.value;
  const operators = operatorsFor(column);
  const operatorKeys = R.map((op) => op.key, operators);

  return operatorKeys.includes(operatorKey) ? operatorKey : operators[0].key;
};

const rhsFromDocument = (index) => {
  const element = document.getElementById(`rhsField${index}`);

  return element ? element.value : undefined;
};

const rhs2FromDocument = (index) => {
  const element = document.getElementById(`rhs2Field${index}`);

  return element ? element.value : undefined;
};

class FilterClauseRow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAddOnClick = this.handleAddOnClickFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
    this.handleRemoveOnClick = this.handleRemoveOnClickFunction.bind(this);
  }

  handleAddOnClickFunction() {
    const { addOnClick, index } = this.props;
    addOnClick(index);
  }

  handleChangeFunction() {
    const { index, onChange, tableColumns } = this.props;
    const column = columnFromDocument(tableColumns, index);
    const operatorKey = operatorKeyFromDocument(column, index);
    const rhs = rhsFromDocument(index);
    const rhs2 = rhs2FromDocument(index);

    let newFilterClause;

    switch (column.type) {
      case FilterClauseType.BOOLEAN:
        newFilterClause = FilterClause.create({
          columnKey: column.key,
          operatorKey,
        });
        break;
      case FilterClauseType.NUMBER:
        newFilterClause = FilterClause.create({
          columnKey: column.key,
          operatorKey,
          rhs: asNumber(rhs),
          rhs2: asNumber(rhs2),
        });
        break;
      case FilterClauseType.STRING:
      case undefined:
        newFilterClause = FilterClause.create({
          columnKey: column.key,
          operatorKey,
          rhs,
        });
        break;
      default:
        throw new Error(`Unknown column.type: ${column.type}`);
    }

    onChange(newFilterClause, index);
  }

  handleRemoveOnClickFunction() {
    const { removeOnClick, index } = this.props;
    removeOnClick(index);
  }

  render() {
    const { filter, index, isRemoveHidden, tableColumns } = this.props;
    const column = columnFor(tableColumns, filter);

    const columnSelect = ReactUtils.createCell(
      createColumnSelect(
        tableColumns,
        filter,
        index,
        column,
        this.handleChange
      ),
      `${column.key}ColumnSelectCell${index}`
    );
    const operatorSelect = ReactUtils.createCell(
      createOperatorSelect(filter, index, column, this.handleChange),
      `${column.key}OperatorSelectCell${index}`
    );
    const filterUI = createFilterClauseUI(
      filter,
      index,
      this.handleChange,
      column.min,
      column.max,
      column.step
    );
    const removeButton = ReactUtils.createCell(
      createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
      `removeButtonCell${index}`
    );
    const addButton = ReactUtils.createCell(
      createAddButton(this.handleAddOnClick),
      `addButtonCell${index}`
    );

    const cells = [
      columnSelect,
      operatorSelect,
      filterUI,
      removeButton,
      addButton,
    ];

    return ReactUtils.createRow(
      cells,
      `${column.key}FilterClauseRow${index}`,
      "frt-filter-row"
    );
  }
}

FilterClauseRow.propTypes = {
  onChange: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  addOnClick: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,

  filter: PropTypes.shape(),
  index: PropTypes.number,
  isRemoveHidden: PropTypes.bool,
};

FilterClauseRow.defaultProps = {
  filter: undefined,
  index: undefined,
  isRemoveHidden: false,
};

export default FilterClauseRow;
