const TableRows = [
  {
    name: "Red",
    red: 255,
    green: 0,
    blue: 0,
    category: "primary",
    components: [255, 0, 0],
    liked: false
  },
  {
    name: "Green",
    red: 0,
    green: 255,
    blue: 0,
    category: "primary",
    components: [0, 255, 0],
    liked: true
  },
  {
    name: "Blue",
    red: 0,
    green: 0,
    blue: 255,
    category: "primary",
    components: [0, 0, 255]
  },
  {
    name: "Yellow",
    red: 255,
    green: 255,
    blue: 0,
    category: "secondary",
    components: [255, 255, 0]
  },
  {
    name: "Magenta",
    red: 255,
    green: 0,
    blue: 255,
    category: "secondary",
    components: [255, 0, 255],
    liked: false
  },
  {
    name: "Cyan",
    red: 0,
    green: 255,
    blue: 255,
    category: "secondary",
    components: [0, 255, 255]
  },
  {
    name: "Orange",
    red: 255,
    green: 127,
    blue: 0,
    category: "tertiary",
    components: [255, 127, 0]
  },
  {
    name: "Rose",
    red: 255,
    green: 0,
    blue: 127,
    category: "tertiary",
    components: [255, 0, 127],
    liked: false
  },
  {
    name: "Chartreuse",
    red: 127,
    green: 255,
    blue: 0,
    category: "tertiary",
    components: [127, 255, 0],
    liked: true
  },
  {
    name: "Spring Green",
    red: 0,
    green: 255,
    blue: 127,
    category: "tertiary",
    components: [0, 255, 127],
    liked: true
  },
  {
    name: "Violet",
    red: 127,
    green: 0,
    blue: 255,
    category: "tertiary",
    components: [127, 0, 255]
  },
  {
    name: "Azure",
    red: 0,
    green: 127,
    blue: 255,
    category: "tertiary",
    components: [0, 127, 255]
  }
];

Object.freeze(TableRows);

export default TableRows;
