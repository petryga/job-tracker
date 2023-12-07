import { Board } from "reducers/types";
import type {
  DrawPieSliceProps,
  DrawTextProps,
  TransformedData,
  isPointInSliceProps,
} from "./ChartModal.types";

export const drawPieSlice = ({
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  color,
  borderColor,
  borderWidth,
}: DrawPieSliceProps) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();

  if (borderWidth > 0) {
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }
};

export const drawText = ({
  ctx,
  centerX,
  centerY,
  radius,
  startAngle,
  endAngle,
  text,
  title,
}: DrawTextProps) => {
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const angle = startAngle + (endAngle - startAngle) / 2;
  const textRadius = radius * 0.7;

  const x = centerX + Math.cos(angle) * textRadius;
  const y = centerY + Math.sin(angle) * textRadius;

  ctx.fillText(title, x, y - 10);
  ctx.fillText(text, x, y + 10);
};

export const getTotal = (data: TransformedData[]) => {
  return data.reduce((total, item) => total + item.value, 0);
};

export const isPointInSlice = ({
  mouseX,
  mouseY,
  sliceStartAngle,
  sliceEndAngle,
  sliceRadius,
  canvas,
}: isPointInSliceProps) => {
  const xFromCenter = mouseX - canvas.width / 2;
  const yFromCenter = mouseY - canvas.height / 2;
  const distanceFromCenter = Math.sqrt(xFromCenter ** 2 + yFromCenter ** 2);
  let angleFromCenter = Math.atan2(yFromCenter, xFromCenter);

  if (angleFromCenter < 0) {
    angleFromCenter = angleFromCenter + 2 * Math.PI;
  }

  sliceStartAngle = sliceStartAngle % (2 * Math.PI);
  sliceEndAngle = sliceEndAngle % (2 * Math.PI);

  if (distanceFromCenter <= sliceRadius) {
    if (sliceStartAngle < sliceEndAngle) {
      return (
        angleFromCenter >= sliceStartAngle && angleFromCenter <= sliceEndAngle
      );
    } else {
      return (
        angleFromCenter >= sliceStartAngle || angleFromCenter <= sliceEndAngle
      );
    }
  }
  return false;
};

export const getTransformedData = (boardState: Board): TransformedData[] => {
  return boardState.lists
    .filter((list) => list.cards.length > 0)
    .map((list) => {
      return {
        value: list.cards.length,
        color: list.cards[0].color,
        title: list.title,
        companies: list.cards.map((card) => card.text),
      };
    });
};
