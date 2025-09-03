// src/geometry/ops/diagnostics.ts
import { Point } from "../types";
import { distance, angleAt, triangleArea, polygonArea } from "./measures";
import { isPerpendicular, isParallel, isCollinear } from "./relations";

export type AngleReport = { at: string; radians: number; degrees: number };
export type LengthReport = { between: [string, string]; length: number };
export type AreaReport = { of: string[]; area: number };

export const angleDiagnostic = (a: Point, b: Point, c: Point): AngleReport => {
  const rad = angleAt(a, b, c);
  return { at: b.id, radians: rad, degrees: (rad * 180) / Math.PI };
};

export const lengthDiagnostic = (a: Point, b: Point): LengthReport =>
  ({ between: [a.id, b.id], length: distance(a, b) });

export const triangleAreaReport = (a: Point, b: Point, c: Point): AreaReport =>
  ({ of: [a.id, b.id, c.id], area: Math.abs(triangleArea(a, b, c)) });
