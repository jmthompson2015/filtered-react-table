import ColumnCheckbox from "./ColumnCheckbox.js";
import ReactUtils from "./ReactUtilities.js";

class ShowColumnsUI extends React.PureComponent {
  constructor(props) {
    super(props);

    const { columnToChecked } = this.props;
    this.state = { columnToChecked };
    this.handleApply = this.handleApplyFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
  }

  createButtonTable() {
    const applyButton = ReactDOMFactories.button({ onClick: this.handleApply }, "Apply");
    const cell = ReactUtils.createCell(applyButton, "applyButton", "button");
    const row = ReactUtils.createRow(cell, "button-row");

    return ReactUtils.createTable(row, "buttonTable", "buttons");
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

  render() {
    const { tableColumns } = this.props;
    const { columnToChecked } = this.state;

    const mapFunction = column => {
      const isChecked = columnToChecked[column.key];
      const checkbox = React.createElement(ColumnCheckbox, {
        column,
        isChecked,
        onChange: this.handleChange
      });
      const cell = ReactUtils.createCell(checkbox);
      return ReactUtils.createRow(cell, column.key);
    };
    const checkboxes = R.map(mapFunction, tableColumns);

    const cell0 = ReactUtils.createTable(checkboxes, "checkboxTable", "checkbox-panel");
    const cell1 = ReactUtils.createCell(this.createButtonTable(), "buttonTable", "button-panel");

    const rows = [
      ReactUtils.createRow(cell0, "checkboxTableRow"),
      ReactUtils.createRow(cell1, "buttonRow")
    ];

    return ReactUtils.createTable(rows, "showColumnsTable", "frt-show-columns");
  }
}

ShowColumnsUI.propTypes = {
  columnToChecked: PropTypes.shape().isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  applyOnClick: PropTypes.func.isRequired
};

export default ShowColumnsUI;
