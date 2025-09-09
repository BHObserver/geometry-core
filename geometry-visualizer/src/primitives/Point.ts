// src/geometry/primitives/Point.ts
import { ID, Point } from "../types";
export const point = (x: number, y: number, id?: ID, label?: string): Point => ({
  id: id ?? crypto.randomUUID() as ID, x, y, label
});
