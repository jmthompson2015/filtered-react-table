import ColumnCheckbox from "./ColumnCheckbox.js";

const { ReactUtilities: RU } = ReactComponent;

class ShowColumnsUI extends React.PureComponent {
  constructor(props) {
    super(props);

    const { columnToChecked } = this.props;
    this.state = { columnToChecked };
    this.handleApply = this.handleApplyFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleApplyFunction() {
    const { applyOnClick } = this.props;
    const { columnToChecked } = this.state;

    applyOnClick(columnToChecked);
  }

  handleChangeFunction(columnKey, isChecked) {
    const { columnToChecked } = this.state;
    const newColumnToChecked = R.assoc(columnKey, isChecked, columnToChecked);

    this.setState({ columnToChecked: newColumnToChecked });
  }

  createButtonTable() {
    const applyButton = ReactDOMFactories.button(
      { onClick: this.handleApply },
      "Apply"
    );
    const cell = RU.createCell(applyButton, "applyButton", "button");
    const row = RU.createRow(cell, "button-row");

    return RU.createTable(row, "buttonTable", "buttons");
  }

  render() {
    const { tableColumns } = this.props;
    const { columnToChecked } = this.state;

    const mapFunction = (column) => {
      const isChecked = columnToChecked[column.key];
      const checkbox = React.createElement(ColumnCheckbox, {
        column,
        isChecked,
        onChange: this.handleChange,
      });
      const cell = RU.createCell(checkbox);
      return RU.createRow(cell, column.key);
    };
    const checkboxes = R.map(mapFunction, tableColumns);

    const cell0 = RU.createTable(checkboxes, "checkboxTable", "checkbox-panel");
    const cell1 = RU.createCell(
      this.createButtonTable(),
      "buttonTable",
      "button-panel"
    );

    const rows = [
      RU.createRow(cell0, "checkboxTableRow"),
      RU.createRow(cell1, "buttonRow"),
    ];

    return RU.createTable(rows, "showColumnsTable", "frt-show-columns");
  }
}

ShowColumnsUI.propTypes = {
  columnToChecked: PropTypes.shape().isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  applyOnClick: PropTypes.func.isRequired,
};

export default ShowColumnsUI;
