class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    const { initialValue } = this.props;
    this.state = { value: initialValue };

    this.handleBlur = this.handleBlurFunction.bind(this);
    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleBlurFunction() {
    const { onBlur } = this.props;
    const { value } = this.state;

    onBlur(value);
  }

  handleChangeFunction(event) {
    const { value } = event.target;

    this.setState({ value });
  }

  render() {
    const { className, id, initialValue } = this.props;

    return ReactDOMFactories.input({
      id,
      type: "number",
      className,
      defaultValue: initialValue,
      onBlur: this.handleBlur,
      onChange: this.handleChange
    });
  }
}

NumberInput.propTypes = {
  onBlur: PropTypes.func.isRequired,

  id: PropTypes.string,
  className: PropTypes.string,
  initialValue: PropTypes.number
};

NumberInput.defaultProps = {
  id: "numberInput",
  className: undefined,
  initialValue: 0
};

export default NumberInput;
