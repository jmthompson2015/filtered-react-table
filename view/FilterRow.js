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

const operatorsFor = column => {
  let answer;

  switch (column.type) {
    case "number":
      answer = NFO;
      break;
    default:
      answer = SFO;
  }

  return EU.values(answer);
};

const createAddButton = handleOnClick => ReactDOMFactories.button({ onClick: handleOnClick }, "+");

const createColumnSelect = (tableColumns, filter, index, column, handleChange) =>
  React.createElement(Select, {
    id: `columnSelect${index}`,
    values: tableColumns,
    initialValue: column.key,
    onChange: handleChange
  });

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

  if (column.type === "number") {
    if (filter.operatorKey === NFO.IS_IN_THE_RANGE) {
      return [
        ReactUtils.createCell(
          React.createElement(NumberInput, {
            id: idKey,
            className: "filterField",
            initialValue: filter ? filter.rhs : undefined,
            onBlur: handleChange
          }),
          `rhs1NumberField${index}`
        ),
        ReactUtils.createCell("to", "toField", "pl2 pr2"),
        ReactUtils.createCell(
          React.createElement(NumberInput, {
            id: `rhs2Field${index}`,
            className: "filterField",
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
        className: "filterField",
        initialValue: filter ? filter.rhs : undefined,
        onBlur: handleChange
      }),
      `rhsNumberField${index}`
    );
  }

  return ReactUtils.createCell(
    React.createElement(StringInput, {
      id: idKey,
      className: "filterField",
      initialValue: filter ? filter.rhs : undefined,
      onBlur: handleChange
    }),
    `rhsStringField${index}`
  );
};

const createRemoveButton = (isRemoveHidden, handleOnClick) =>
  ReactDOMFactories.button({ hidden: isRemoveHidden, onClick: handleOnClick }, "-");

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
    const columnKey = document.getElementById(`columnSelect${index}`).value;
    const operatorKey = document.getElementById(`operatorSelect${index}`).value;
    const rhs = document.getElementById(`rhsField${index}`).value;

    let rhs2;
    const rhs2Element = document.getElementById(`rhs2Field${index}`);

    if (rhs2Element) {
      rhs2 = rhs2Element.value;
    }

    let newFilter;
    const column = TCU.tableColumn(tableColumns, columnKey);

    if (column.type === "number") {
      newFilter = Filter.create({
        columnKey,
        operatorKey,
        rhs: parseInt(rhs, 10),
        rhs2: rhs2 ? parseInt(rhs2, 10) : undefined
      });
    } else {
      newFilter = Filter.create({
        columnKey,
        operatorKey,
        rhs
      });
    }

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
