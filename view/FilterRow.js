import BFO from "../state/BooleanFilterOperator.js";
import EU from "../state/EnumUtilities.js";
import Filter from "../state/Filter.js";
import NFO from "../state/NumberFilterOperator.js";
import SFO from "../state/StringFilterOperator.js";
import TCU from "../state/TableColumnUtilities.js";

import NumberInput from "./NumberInput.js";
import ReactUtils from "./ReactUtilities.js";
import Select from "./Select.js";
import StringInput from "./StringInput.js";

const columnFor = (tableColumns, filter) => {
  const firstColumnKey = Object.values(tableColumns)[0].key;
  const columnKey = filter ? filter.columnKey || firstColumnKey : firstColumnKey;

  return TCU.tableColumn(tableColumns, columnKey);
};

const columnFromDocument = (tableColumns, index) => {
  const element = document.getElementById(`columnSelect${index}`);
  const columnKey = element.value;

  return TCU.tableColumn(tableColumns, columnKey);
};

const createAddButton = handleOnClick => ReactDOMFactories.button({ onClick: handleOnClick }, "+");

const createColumnSelect = (tableColumns, filter, index, column, handleChange) =>
  React.createElement(Select, {
    id: `columnSelect${index}`,
    values: tableColumns,
    initialValue: column.key,
    onChange: handleChange
  });

const operatorsFor = column => {
  let answer;

  switch (column.type) {
    case "boolean":
      answer = BFO;
      break;
    case "number":
      answer = NFO;
      break;
    default:
      answer = SFO;
  }

  return EU.values(answer);
};

const createOperatorSelect = (filter, index, column, handleChange) => {
  const operators = operatorsFor(column);

  return React.createElement(Select, {
    id: `operatorSelect${index}`,
    values: operators,
    initialValue: filter ? filter.operatorKey : undefined,
    onChange: handleChange
  });
};

const createFilterUI = (filter, index, column, handleChange) => {
  const idKey = `rhsField${index}`;

  if (column.type === "boolean") {
    return ReactUtils.createCell(ReactDOMFactories.span({}, ""), `rhsBooleanField${index}`);
  }

  if (column.type === "number") {
    if (filter.operatorKey === NFO.IS_IN_THE_RANGE) {
      return [
        ReactUtils.createCell(
          React.createElement(NumberInput, {
            id: idKey,
            className: "field",
            initialValue: filter ? filter.rhs : undefined,
            onBlur: handleChange
          }),
          `rhs1NumberField${index}`
        ),
        ReactUtils.createCell("to", "toField", "pl2 pr2"),
        ReactUtils.createCell(
          React.createElement(NumberInput, {
            id: `rhs2Field${index}`,
            className: "field",
            initialValue: filter ? filter.rhs2 : undefined,
            onBlur: handleChange
          }),
          `rhs2NumberField${index}`
        )
      ];
    }

    return ReactUtils.createCell(
      React.createElement(NumberInput, {
        id: idKey,
        className: "field",
        initialValue: filter ? filter.rhs : undefined,
        onBlur: handleChange
      }),
      `rhsNumberField${index}`
    );
  }

  return ReactUtils.createCell(
    React.createElement(StringInput, {
      id: idKey,
      className: "field",
      initialValue: filter ? filter.rhs : undefined,
      onBlur: handleChange
    }),
    `rhsStringField${index}`
  );
};

const createRemoveButton = (isRemoveHidden, handleOnClick) =>
  ReactDOMFactories.button({ hidden: isRemoveHidden, onClick: handleOnClick }, "-");

const operatorKeyFromDocument = (column, index) => {
  const element = document.getElementById(`operatorSelect${index}`);
  const operatorKey = element.value;
  const operators = operatorsFor(column);
  const operatorKeys = R.map(op => op.key, operators);

  return operatorKeys.includes(operatorKey) ? operatorKey : operators[0].key;
};

const rhsFromDocument = index => {
  const element = document.getElementById(`rhsField${index}`);

  return element ? element.value : undefined;
};

const rhs2FromDocument = index => {
  const element = document.getElementById(`rhs2Field${index}`);

  return element ? element.value : undefined;
};

class FilterRow extends React.Component {
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

    let newFilter;

    if (column.type === "boolean") {
      newFilter = Filter.create({
        columnKey: column.key,
        operatorKey
      });
    } else if (column.type === "number") {
      newFilter = Filter.create({
        columnKey: column.key,
        operatorKey,
        rhs: rhs ? parseInt(rhs, 10) : undefined,
        rhs2: rhs2 ? parseInt(rhs2, 10) : undefined
      });
    } else {
      newFilter = Filter.create({
        columnKey: column.key,
        operatorKey,
        rhs
      });
    }

    // console.log(`FilterRow.handleChange() newFilter = ${JSON.stringify(newFilter)}`);
    onChange(newFilter, index);
  }

  handleRemoveOnClickFunction() {
    const { removeOnClick, index } = this.props;
    removeOnClick(index);
  }

  render() {
    const { filter, index, isRemoveHidden, tableColumns } = this.props;
    const column = columnFor(tableColumns, filter);

    const columnSelect = ReactUtils.createCell(
      createColumnSelect(tableColumns, filter, index, column, this.handleChange),
      `${column.key}ColumnSelectCell${index}`
    );
    const operatorSelect = ReactUtils.createCell(
      createOperatorSelect(filter, index, column, this.handleChange),
      `${column.key}OperatorSelectCell${index}`
    );
    const filterUI = createFilterUI(filter, index, column, this.handleChange);
    const removeButton = ReactUtils.createCell(
      createRemoveButton(isRemoveHidden, this.handleRemoveOnClick),
      `removeButtonCell${index}`
    );
    const addButton = ReactUtils.createCell(
      createAddButton(this.handleAddOnClick),
      `addButtonCell${index}`
    );

    const cells = [columnSelect, operatorSelect, filterUI, removeButton, addButton];

    return ReactUtils.createRow(cells, `${column.key}FilterRow${index}`);
  }
}

FilterRow.propTypes = {
  onChange: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,

  addOnClick: PropTypes.func.isRequired,
  removeOnClick: PropTypes.func.isRequired,

  filter: PropTypes.shape(),
  index: PropTypes.number,
  isRemoveHidden: PropTypes.bool
};

FilterRow.defaultProps = {
  filter: undefined,
  index: undefined,
  isRemoveHidden: false
};

export default FilterRow;
