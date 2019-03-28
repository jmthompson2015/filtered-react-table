const TableRows = [
  {
    id: 1,
    name: "Red",
    red: 255,
    green: 0,
    blue: 0,
    category: "primary",
    components: [255, 0, 0],
    liked: false
  },
  {
    id: 2,
    name: "Green",
    red: 0,
    green: 255,
    blue: 0,
    category: "primary",
    components: [0, 255, 0],
    liked: true
  },
  {
    id: 3,
    name: "Blue",
    red: 0,
    green: 0,
    blue: 255,
    category: "primary",
    components: [0, 0, 255]
  },
  {
    id: 4,
    name: "Yellow",
    red: 255,
    green: 255,
    blue: 0,
    category: "secondary",
    components: [255, 255, 0]
  },
  {
    id: 5,
    name: "Magenta",
    red: 255,
    green: 0,
    blue: 255,
    category: "secondary",
    components: [255, 0, 255],
    liked: false
  },
  {
    id: 6,
    name: "Cyan",
    red: 0,
    green: 255,
    blue: 255,
    category: "secondary",
    components: [0, 255, 255]
  },
  {
    id: 7,
    name: "Orange",
    red: 255,
    green: 127,
    blue: 0,
    category: "tertiary",
    components: [255, 127, 0]
  },
  {
    id: 8,
    name: "Rose",
    red: 255,
    green: 0,
    blue: 127,
    category: "tertiary",
    components: [255, 0, 127],
    liked: false
  },
  {
    id: 9,
    name: "Chartreuse",
    red: 127,
    green: 255,
    blue: 0,
    category: "tertiary",
    components: [127, 255, 0],
    liked: true
  },
  {
    id: 10,
    name: "Spring Green",
    red: 0,
    green: 255,
    blue: 127,
    category: "tertiary",
    components: [0, 255, 127],
    liked: true
  },
  {
    id: 11,
    name: "Violet",
    red: 127,
    green: 0,
    blue: 255,
    category: "tertiary",
    components: [127, 0, 255]
  },
  {
    id: 12,
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
