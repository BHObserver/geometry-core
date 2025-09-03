// src/geometry/ops/measures.ts
import { Point, Segment, Triangle, Circle } from "../types";
import { approxEq } from "../math/numeric";

export const distance = (p: Point, q: Point) => Math.hypot(p.x - q.x, p.y - q.y);

export const angleAt = (a: Point, b: Point, c: Point) => {
  const v1x = a.x - b.x, v1y = a.y - b.y;
  const v2x = c.x - b.x, v2y = c.y - b.y;
  const dot = v1x * v2x + v1y * v2y;
  const den = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
  if (den === 0) return NaN;
  return Math.acos(clamp(dot / den, -1, 1)); // radians
};

export const triangleArea = (a: Point, b: Point, c: Point) =>
  0.5 * ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)); // signed

export const polygonArea = (pts: Point[]): number => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    s += p.x * q.y - p.y * q.x;
  }
  return 0.5 * s; // signed; abs for magnitude
};
