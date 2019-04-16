import CollapsiblePanel from "./CollapsiblePanel.js";

const child1 = ReactDOMFactories.div({}, "Some very important content.");
const element1 = React.createElement(CollapsiblePanel, {
  title: "Important Title",
  child: child1
});
ReactDOM.render(element1, document.getElementById("panel"));
