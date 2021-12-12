import { useEffect, useRef } from 'react';

function getPieceAngle(piece: number): [number, number] {
  return [Math.cos(piece * 2 * Math.PI), Math.sin(piece * 2 * Math.PI)];
}

export function getNussinovPlot(
  canvas: HTMLCanvasElement,
  pairsString: string,
  pairs: [number, number][],
) {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('Drawing context is null');
  }

  const width = 500;
  const height = width;

  const circleRadius = Math.floor(width / 2.4);
  const circleX = width / 2;
  const circleY = height / 2;

  // Draw circle
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();

  const pairsCount = pairsString.length;
  const tickSize = 16;

  // Draw each tick and symbol
  ctx.font = '20px Arial';
  for (let i = 0; i < pairsCount; i += 1) {
    const piece = i / pairsCount;
    const [angleX, angleY] = getPieceAngle(piece);

    // Draw tick
    ctx.beginPath();
    ctx.moveTo(
      circleX + angleX * (circleRadius - tickSize / 2),
      circleY + angleY * (circleRadius - tickSize / 2),
    );
    ctx.lineTo(
      circleX + angleX * (circleRadius + tickSize / 2),
      circleY + angleY * (circleRadius + tickSize / 2),
    );
    ctx.stroke();

    // Draw label
    const textRadius = circleRadius + 20;
    const offsetX = 7;
    const offsetY = -7;
    ctx.fillText(
      pairsString[i],
      circleX + angleX * textRadius - offsetX,
      circleY + angleY * textRadius - offsetY,
    );
  }

  // Set chord style
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'magenta');
  gradient.addColorStop(0.5, 'blue');
  gradient.addColorStop(1, 'red');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;

  // Draw each chord
  for (let i = 0; i < pairs.length; i += 1) {
    const piece1 = pairs[i][0] / pairsCount;
    const piece2 = pairs[i][1] / pairsCount;
    const [angleX1, angleY1] = getPieceAngle(piece1);
    const [angleX2, angleY2] = getPieceAngle(piece2);

    // Draw chord line
    ctx.beginPath();
    ctx.moveTo(
      circleX + angleX1 * circleRadius,
      circleY + angleY1 * circleRadius,
    );
    ctx.lineTo(
      circleX + angleX2 * circleRadius,
      circleY + angleY2 * circleRadius,
    );
    ctx.stroke();
  }
}

const NussinovPlot = function NussinovPlot(): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvas.current) {
      getNussinovPlot(canvas.current, 'GATTATCAATTACA', [[0, 6], [1, 5], [2, 4], [7, 10], [8, 9]]);
    }
  }, []);

  return (
    <canvas width="500" height="500" ref={canvas} />
  );
};

export default NussinovPlot;
