class ColumnCheckbox extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleChangeFunction(event) {
    const { column, onChange } = this.props;
    const { checked } = event.target;

    onChange(column.key, checked);
  }

  render() {
    const { column, isChecked } = this.props;

    const input = ReactDOMFactories.input({
      key: `${column.key}${isChecked}`,
      type: "checkbox",
      checked: isChecked,
      onChange: this.handleChange,
      style: { verticalAlign: "middle" }
    });
    const labelElement = ReactDOMFactories.span(
      { style: { verticalAlign: "middle" } },
      column.label
    );

    return ReactDOMFactories.label(
      { style: { display: "block", verticalAlign: "middle" } },
      input,
      labelElement
    );
  }
}

ColumnCheckbox.propTypes = {
  column: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,

  isChecked: PropTypes.bool
};

ColumnCheckbox.defaultProps = {
  isChecked: false
};

export default ColumnCheckbox;
