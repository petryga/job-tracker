
const colors = [
  "#FACC00",
  "#FC8025",
  "#FB6A79",
  "#FB8355",
  "#FB6A85",
  "#EE649C",
  "#ACCF93",
  "#33AFFA",
  "#4177F7",
  "#637DB4",
  "#E84779",
  "#53C0A1",
  "#75DF9A",
];

export const getRandomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const tabProps = {
  style: { background: getRandomColor() },
};

