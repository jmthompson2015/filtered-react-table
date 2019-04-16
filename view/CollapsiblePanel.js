import ReactUtils from "./ReactUtilities.js";

const CLOSED = "\u25B6";
const OPEN = "\u25BC";

const createControl = (image, onClick) =>
  ReactDOMFactories.span({ key: "control", className: "control", onClick }, image);

const createLabel = title => ReactDOMFactories.span({ key: "label", className: "label" }, title);

const createPanel = child =>
  ReactDOMFactories.div({ key: "childPanel", className: "child-panel" }, child);

class CollapsiblePanel extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isCollapsed: true };

    this.handleChange = this.handleChangeFunction.bind(this);
  }

  handleChangeFunction() {
    const { isCollapsed } = this.state;

    this.setState({ isCollapsed: !isCollapsed });
  }

  render() {
    const { isCollapsed } = this.state;
    const { child, title } = this.props;

    const image = isCollapsed ? CLOSED : OPEN;
    const control = createControl(image, this.handleChange);
    const label = createLabel(title);

    const cell0 = ReactUtils.createCell([control, label], "titleCell", "title-cell");
    let answer;

    if (isCollapsed) {
      const row = ReactUtils.createRow(cell0, "titleRow");
      answer = ReactUtils.createTable(row, "collapsiblePanel", "frt-collapsible-panel");
    } else {
      const panel = createPanel(child);
      const cell1 = ReactUtils.createCell(panel, "childCell", "child-cell");
      const rows = [
        ReactUtils.createRow(cell0, "titleRow"),
        ReactUtils.createRow(cell1, "childRow")
      ];
      answer = ReactUtils.createTable(rows, "collapsiblePanel", "frt-collapsible-panel");
    }

    return answer;
  }
}

CollapsiblePanel.propTypes = {
  title: PropTypes.string.isRequired,
  child: PropTypes.shape().isRequired
};

export default CollapsiblePanel;
