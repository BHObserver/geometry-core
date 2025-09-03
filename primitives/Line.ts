// src/geometry/primitives/Line.ts
import { ID, Line, Point } from "../types";

const normalize = (a: number, b: number, c: number) => {
  const s = Math.hypot(a, b) || 1;
  const sign = a < 0 || (a === 0 && b < 0) ? -1 : 1;
  return { a: (a / s) * sign, b: (b / s) * sign, c: (c / s) * sign };
};

export const lineThrough = (p1: Point, p2: Point, id?: ID): Line => {
  const a = p2.y - p1.y;
  const b = p1.x - p2.x;
  const c = -(a * p1.x + b * p1.y);
  const n = normalize(a, b, c);
  return { id: id ?? (crypto.randomUUID() as ID), ...n, through: [p1.id, p2.id] };
};
