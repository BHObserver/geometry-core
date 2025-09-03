// src/geometry/ops/constructions.ts
import { Point, Line } from "../types";
import { lineThrough } from "../primitives/Line";

export const midpoint = (a: Point, b: Point): Point =>
  ({ id: crypto.randomUUID() as any, x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export const perpendicularLineAt = (l: Line, p: Point): Line => {
  // If l: ax + by + c = 0, a perpendicular has direction (a, b) swapped/negated: (b, -a)
  const a = l.b, b = -l.a, c = -(a * p.x + b * p.y);
  // reuse Line.ts normalize helper if exported
  const s = Math.hypot(a, b) || 1;
  return { id: crypto.randomUUID() as any, a: a / s, b: b / s, c: c / s };
};

export const perpendicularBisector = (a: Point, b: Point): { mid: Point; bisector: Line } => {
  const mid = midpoint(a, b);
  const base = lineThrough(a, b);
  const bisector = perpendicularLineAt(base, mid);
  return { mid, bisector };
};

// Foot of perpendicular from P to line AB
export const footOfPerpendicular = (a: Point, b: Point, p: Point): Point => {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
  return { id: crypto.randomUUID() as any, x: a.x + t * dx, y: a.y + t * dy };
};
