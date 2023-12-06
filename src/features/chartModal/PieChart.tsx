import { useRef, useEffect, useState } from "react";
import {
  drawPieSlice,
  drawText,
  getTotal,
  getTransformedData,
  isPointInSlice,
} from "./helpers";
import { Board } from "reducers/types";

export const PieChart = ({ boardState }: { boardState: Board }) => {
  const data = getTransformedData(boardState);
  const canvasRef = useRef(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const total = getTotal(data);

  useEffect(() => {
    let startAngle = 0;
    const canvas = canvasRef.current as any;
    const ctx = canvas.getContext("2d");

    data.forEach((item) => {
      const percentage = ((item.value / total) * 100).toFixed(2) + "%";
      const sliceAngle = (2 * Math.PI * item.value) / total;
      drawPieSlice(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width / 2, canvas.height / 2),
        startAngle,
        startAngle + sliceAngle,
        item.color,
        "#fff",
        5
      );

      drawText(
        ctx,
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width / 2, canvas.height / 2),
        startAngle,
        startAngle + sliceAngle,
        percentage,
        item.title
      );
      startAngle += sliceAngle;
    });

    const onMouseMove = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      let isInSlice = false;

      let currentAngle = 0;
      for (let i = 0; i < data.length; i++) {
        const sliceAngle = (2 * Math.PI * data[i].value) / total;

        if (
          isPointInSlice(
            mouseX,
            mouseY,
            currentAngle,
            currentAngle + sliceAngle,
            canvas.width / 2,
            canvas
          )
        ) {
          setHoveredSlice(data[i] as any);
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

  const Tooltip = ({ slice }: any) => {
    if (!slice) return null;
    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "10%",
          color: slice.color,
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {slice.companies.join(", ")}
      </div>
    );
  };

  return (
    <>
      <canvas ref={canvasRef} width={400} height={400} />
      <Tooltip slice={hoveredSlice} />
    </>
  );
};
