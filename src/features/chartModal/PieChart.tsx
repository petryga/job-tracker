import { useRef, useEffect, useState } from "react";
import {
  drawPieSlice,
  drawText,
  getTotal,
  getTransformedData,
  isPointInSlice,
} from "./helpers";
import { Board } from "reducers/types";
import type { TransformedData } from "./ChartModal.types";
import styles from "./PieChart.module.css";

export const PieChart = ({ boardState }: { boardState: Board }) => {
  const data = getTransformedData(boardState);
  const canvasRef = useRef(null);
  const [hoveredSlice, setHoveredSlice] = useState<TransformedData | null>(
    null
  );
  const total = getTotal(data);

  useEffect(() => {
    let startAngle = 0;
    const canvas = canvasRef.current as unknown as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    data.forEach((item) => {
      const percentage = ((item.value / total) * 100).toFixed(2) + "%";
      const sliceAngle = (2 * Math.PI * item.value) / total;
      drawPieSlice({
        ctx,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        radius: Math.min(canvas.width / 2, canvas.height / 2),
        startAngle,
        endAngle: startAngle + sliceAngle,
        color: item.color,
        borderColor: "#fff",
        borderWidth: 5,
      });

      drawText({
        ctx,
        centerX: canvas.width / 2,
        centerY: canvas.height / 2,
        radius: Math.min(canvas.width / 2, canvas.height / 2),
        startAngle,
        endAngle: startAngle + sliceAngle,
        text: percentage,
        title: item.title,
      });
      startAngle += sliceAngle;
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      let isInSlice = false;

      let currentAngle = 0;
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (2 * Math.PI * data[i].value) / total;

        if (
          isPointInSlice({
            mouseX,
            mouseY,
            sliceStartAngle: currentAngle,
            sliceEndAngle: currentAngle + sliceAngle,
            sliceRadius: canvas.width / 2,
            canvas,
          })
        ) {
          setHoveredSlice(data[i]);
          isInSlice = true;
          break;
        }
        currentAngle += sliceAngle;
      }

      if (!isInSlice) {
        setHoveredSlice(null);
      }
    };

    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [data, total]);

  const Tooltip = ({ slice }: { slice: TransformedData | null }) => {
    if (!slice) return null;

    return (
      <div
        className={styles.tooltip}
        style={{
          color: slice.color,
        }}
      >
        {slice.companies.map((company, index) => (
          <div key={index}>{company}</div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} width={550} height={400} />
      <Tooltip slice={hoveredSlice} />
    </div>
  );
};
