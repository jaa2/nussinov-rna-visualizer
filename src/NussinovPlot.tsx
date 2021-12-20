import { useEffect, useRef } from 'react';

/**
 * Finds the angle offset of a set of points arranged in a circle, starting at the top
 * @param numBases number of points in the circle
 * @returns the angle of the first point in the circle
 */
export function getOffsetAngle(numBases: number) {
  let arcOffset = (2 * Math.PI * 270) / 360;
  if (numBases > 1) {
    arcOffset += (2 * Math.PI) / numBases / 2;
  }
  return arcOffset % (2 * Math.PI);
}

/**
 * Finds the x and y position of a point at a given angle on a circle
 * @param piece Fraction of the entire circle
 * @param arcOffset Offset angle
 * @returns The x and y position for a circle of radius 1
 */
function getPieceAngle(piece: number, arcOffset: number): [number, number] {
  return [Math.cos(arcOffset + piece * 2 * Math.PI), Math.sin(arcOffset + piece * 2 * Math.PI)];
}

/**
 * Draws a Nussinov plot on a canvas with base pairs
 * @param canvas Canvas element on which to draw
 * @param bases String of all the bases in order
 * @param pairs An array of base pair index arrays
 */
export function drawNussinovPlot(
  canvas: HTMLCanvasElement,
  bases: string,
  pairs: [number, number][],
  width: number,
) {
  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return;
  }

  const height = width;

  const circleRadius = Math.floor(width / 2.4);
  const circleX = width / 2;
  const circleY = height / 2;

  // Draw circle
  const lineWidthThin = 0.3;
  const lineWidthThick = 2;
  const arcOffset = getOffsetAngle(bases.length);

  if (bases.length < 2) {
    // Draw complete circle
    ctx.lineWidth = lineWidthThick;
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleRadius, arcOffset + 0, arcOffset + 2 * Math.PI);
    ctx.stroke();
  } else {
    // Draw small arc
    ctx.lineWidth = lineWidthThin;
    ctx.beginPath();
    ctx.arc(
      circleX,
      circleY,
      circleRadius,
      arcOffset + (2 * Math.PI * (bases.length - 1)) / bases.length,
      arcOffset + 2 * Math.PI,
    );
    ctx.stroke();
    // Draw large arc
    ctx.lineWidth = lineWidthThick;
    ctx.beginPath();
    ctx.arc(
      circleX,
      circleY,
      circleRadius,
      arcOffset + 0,
      arcOffset + (2 * Math.PI * (bases.length - 1)) / bases.length,
    );
    ctx.stroke();
  }

  const pairsCount = bases.length;
  const tickSize = 16;

  // Draw each tick and symbol
  ctx.font = '20px Arial';
  for (let i = 0; i < pairsCount; i += 1) {
    const piece = i / pairsCount;
    const [angleX, angleY] = getPieceAngle(piece, arcOffset);

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
      bases[i],
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
    const [angleX1, angleY1] = getPieceAngle(piece1, arcOffset);
    const [angleX2, angleY2] = getPieceAngle(piece2, arcOffset);

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
export interface INussinovPlotProps {
  bases: string,
  pairs: [number, number][]
}

const NussinovPlot = function NussinovPlot(props: INussinovPlotProps): JSX.Element {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { bases, pairs } = props;
  useEffect(() => {
    if (canvas.current) {
      drawNussinovPlot(canvas.current, bases, pairs, canvas.current.width);
    }
  }, []);

  return (
    <canvas width="550" height="550" ref={canvas} />
  );
};

export default NussinovPlot;
