export interface TransformedData {
  value: number;
  color: string;
  title: string;
  companies: string[];
}

export interface DrawPieSliceProps {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  color: string;
  borderColor: string;
  borderWidth: number;
}

export interface DrawTextProps {
  ctx: CanvasRenderingContext2D;
  centerX: number;
  centerY: number;
  radius: number;
  startAngle: number;
  endAngle: number;
  text: string;
  title: string;
}

export interface isPointInSliceProps {
  mouseX: number;
  mouseY: number;
  sliceStartAngle: number;
  sliceEndAngle: number;
  sliceRadius: number;
  canvas: HTMLCanvasElement;
}
