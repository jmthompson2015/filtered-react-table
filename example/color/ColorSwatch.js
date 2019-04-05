import RU from "../../view/ReactUtilities.js";

const toString = ({ r, g, b }) => `rgb(${r},${g},${b})`;
const toStyle = ({ r, g, b }) => `rgb(${r},${g},${b})`;

class ColorSwatch extends React.PureComponent {
  render() {
    const { color, height, showDescription, showTitle, width } = this.props;

    const swatch = ReactDOMFactories.div({
      style: { backgroundColor: toStyle(color), height, width }
    });

    if (showTitle || showDescription) {
      const { descriptionClass, title, titleClass } = this.props;
      const rows = [];

      if (showTitle) {
        const titleUI = RU.createSpan(title);
        const cell0 = RU.createCell(titleUI, "titleCell", titleClass);
        rows.push(RU.createRow(cell0, "titleRow"));
      }

      const cell1 = RU.createCell(swatch, "swatchCell");
      rows.push(RU.createRow(cell1, "swatchRow"));

      if (showDescription) {
        const description = toString(color);
        const descriptionUI = RU.createSpan(description);
        const cell2 = RU.createCell(descriptionUI, "descriptionCell", descriptionClass);
        rows.push(RU.createRow(cell2, "descriptionRow"));
      }

      return RU.createTable(rows, "colorSwatchTable");
    }

    return swatch;
  }
}

ColorSwatch.propTypes = {
  color: PropTypes.shape().isRequired,

  descriptionClass: PropTypes.string,
  height: PropTypes.number,
  showDescription: PropTypes.bool,
  showTitle: PropTypes.bool,
  title: PropTypes.string,
  titleClass: PropTypes.string,
  width: PropTypes.number
};

ColorSwatch.defaultProps = {
  descriptionClass: undefined,
  height: 25,
  showTitle: false,
  showDescription: false,
  title: "Color",
  titleClass: undefined,
  width: 110
};

export default ColorSwatch;
