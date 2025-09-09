// components/geometry/utils/geometryUtils.ts
import geometric from "geometric";

export type Coord = [number, number];

export const pointOnCircle = (
  center: Coord,
  r: number,
  angleDeg: number
): Coord => {
  const angleRad = (angleDeg * Math.PI) / 180;
  return [center[0] + r * Math.cos(angleRad), center[1] + r * Math.sin(angleRad)];
};

export const midpoint = (a: Coord, b: Coord): Coord => geometric.lineMidpoint([a, b]);

export const distance = (a: Coord, b: Coord): number => geometric.lineLength([a, b]);

export const polygonArea = (points: Coord[]): number => geometric.polygonArea(points);

// convenience: convert to Point type
import { Point } from "../data/theorems";
export const makePoint = (
  id: string,
  coord: Coord,
  label?: string,
  color?: string,
  radius = 5
): Point => ({
  id,
  x: coord[0],
  y: coord[1],
  label,
  color,
  radius,
});
